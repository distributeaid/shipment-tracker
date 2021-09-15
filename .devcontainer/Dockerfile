FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:16

# Install PostgreSQL
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add - \
    && sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list' \
    && apt-get update \
    && apt-get -y install postgresql postgresql-client

# Add role for user node
RUN /etc/init.d/postgresql start \
    && sudo -u postgres createuser -s node

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
RUN apt-get -y install direnv \
    && echo 'eval "$(direnv hook bash)"' >> /home/node/.bashrc \
    && echo 'eval "$(direnv hook zsh)"' >> /home/node/.zshrc
