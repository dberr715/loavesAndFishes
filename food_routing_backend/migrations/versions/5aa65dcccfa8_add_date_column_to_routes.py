"""Add date column to routes

Revision ID: 5aa65dcccfa8
Revises: d2acdd0c28ed
Create Date: 2024-11-11 13:05:31.390769

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5aa65dcccfa8'
down_revision: Union[str, None] = 'd2acdd0c28ed'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
