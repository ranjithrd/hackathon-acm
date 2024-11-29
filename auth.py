import datetime
import jwt
import requests
from functools import wraps
from flask import Flask, request
from config import CONFIG
from cryptography import x509
from cryptography.hazmat.backends import default_backend


ADMIN_TOKEN = CONFIG.ADMIN_TOKEN

firebase_keys = {}
firebase_keys_loaded = False
firebase_keys_loaded_timestamp = 0
firebase_decoded_keys = {}


def get_firebase_keys():
    global firebase_keys, firebase_keys_loaded, firebase_keys_loaded_timestamp

    if firebase_keys_loaded and (
        datetime.datetime.now() - firebase_keys_loaded_timestamp
    ) < datetime.timedelta(hours=5):
        return firebase_keys
    else:
        print("KEYS EXPIRED OR NOT FOUND")
        print("FETCHING FIREBASE KEYS")
        req = requests.get(
            "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
        )
        if req.ok:
            firebase_keys = req.json()
            firebase_keys_loaded = True
            firebase_keys_loaded_timestamp = datetime.datetime.now()
        else:
            raise RuntimeError("Firebase keys not found!")
        return firebase_keys


def get_decoded_key(kid):
    keys = get_firebase_keys()
    cert_pem = keys.get(kid)

    if not cert_pem:
        return None, False

    if kid not in firebase_decoded_keys:
        cert = x509.load_pem_x509_certificate(cert_pem.encode(), default_backend())
        public_key = cert.public_key()
        firebase_decoded_keys[kid] = public_key
    else:
        public_key = firebase_decoded_keys[kid]

    return public_key, True


def check_jwt(token: str):
    try:
        unverified_header = jwt.get_unverified_header(token)
        keys = get_firebase_keys()

        if unverified_header.get("kid") in keys:
            public_key, ok = get_decoded_key(unverified_header["kid"])
            if not ok:
                return False

            claims = jwt.decode(
                token, public_key, algorithms=["RS256"], audience="rtoapp-2ac"
            )
            return "user_id" in claims
        return False
    except Exception as e:
        print(f"JWT validation error: {e}")
        return False


def ensure_authenticated(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        valid = False
        try:
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
                if token == ADMIN_TOKEN:
                    print("ADMIN ACCESS")
                    valid = True
                else:
                    jwt_valid = check_jwt(token)
                    if jwt_valid:
                        print("USER ACCESS")
                        valid = True
        except Exception as e:
            print(f"Authentication error: {e}")
            valid = False

        if valid:
            return f(*args, **kwargs)
        else:
            return {"message": "Forbidden"}, 403

    return decorated_function
