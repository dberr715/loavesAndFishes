"""Add new fields to models

Revision ID: 435353bb6c7f
Revises: c204bdb86073
Create Date: 2024-11-11 13:16:33.973148

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '435353bb6c7f'
down_revision: Union[str, None] = 'c204bdb86073'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
