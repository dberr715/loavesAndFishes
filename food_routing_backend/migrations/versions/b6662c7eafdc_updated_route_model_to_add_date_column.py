"""Updated Route model to add date column

Revision ID: b6662c7eafdc
Revises: 435353bb6c7f
Create Date: 2024-11-17 12:08:36.893104

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b6662c7eafdc'
down_revision: Union[str, None] = '435353bb6c7f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
