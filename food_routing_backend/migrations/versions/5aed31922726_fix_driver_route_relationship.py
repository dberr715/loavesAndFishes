"""Fix driver-route relationship

Revision ID: 5aed31922726
Revises: 5aa65dcccfa8
Create Date: 2024-11-11 13:06:40.220931

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5aed31922726'
down_revision: Union[str, None] = '5aa65dcccfa8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
