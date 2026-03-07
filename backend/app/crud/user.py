from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.user import User


def get_user_by_email(db: Session, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    return db.execute(stmt).scalar_one_or_none()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)


def get_user_by_customer_id(db: Session, customer_id: int) -> User | None:
    stmt = select(User).where(User.customer_id == customer_id)
    return db.execute(stmt).scalar_one_or_none()


def get_available_customer(db: Session) -> Customer | None:
    used_customer_ids = db.execute(select(User.customer_id)).scalars().all()

    stmt = select(Customer).order_by(Customer.customer_id.asc())

    if used_customer_ids:
        stmt = stmt.where(Customer.customer_id.not_in(used_customer_ids))

    return db.execute(stmt).scalars().first()


def create_user(
    db: Session,
    email: str,
    full_name: str,
    hashed_password: str,
    customer_id: int,
    role: str = "user",
) -> User:
    user = User(
        email=email,
        full_name=full_name,
        hashed_password=hashed_password,
        customer_id=customer_id,
        role=role,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user