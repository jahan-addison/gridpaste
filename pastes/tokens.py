from hashids import Hashids
import random


def generate_token() -> str:
    hashids = Hashids(
        salt="salt here",
        min_length=6
    )
    rints = random.sample(range(100, 999), 2)
    encoded = hashids.encode(rints[0], rints[1])

    return encoded