FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu

# Install PostgreSQL
RUN export DEBIAN_FRONTEND=noninteractive \
    && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list' \
    && apt-get update \
    && apt-get -y install postgresql postgresql-client

# Add role for user vscode
RUN /etc/init.d/postgresql start \
    && sudo -u postgres createuser -s vscode

# Add role and db for running tests
RUN /etc/init.d/postgresql start \
    && sudo -u postgres createuser -s distributeaid_test \
    && sudo -u postgres psql -c "ALTER USER distributeaid_test PASSWORD 'distributeaid_test';" \
    && sudo -u postgres createdb distributeaid_test

# Add role and db for running the development server
RUN /etc/init.d/postgresql start \
    && sudo -u postgres createuser -s distributeaid \
    && sudo -u postgres psql -c "ALTER USER distributeaid PASSWORD 'distributeaid';" \
    && sudo -u postgres createdb distributeaid_dev

# Install direnv
RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install direnv \
    && echo 'eval "$(direnv hook bash)"' >> /home/vscode/.bashrc \
    && echo 'eval "$(direnv hook zsh)"' >> /home/vscode/.zshrc

# Install Node.js 16
RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && npm install -g npm@ \
    && node -v \
    && npm -v

# Install Playwright dependencies
ENV PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
RUN npx playwright install-deps
RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y firefox

# Install yarn
RUN npm install --global yarn@