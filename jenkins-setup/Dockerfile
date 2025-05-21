# Choose your base Jenkins image (LTS is often a good choice)
ARG JENKINS_IMAGE_TAG=lts-jdk11
FROM jenkins/jenkins:${JENKINS_IMAGE_TAG}

# Switch to root to install packages
USER root

# Install Docker CLI and other necessary tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        software-properties-common \
        sudo && \
    rm -rf /var/lib/apt/lists/*

# Add Docker's official GPG key and set up the stable repository
RUN mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker CLI (docker-ce-cli)
RUN apt-get update && \
    apt-get install -y --no-install-recommends docker-ce-cli && \
    rm -rf /var/lib/apt/lists/*

# Install Docker Compose (V2 - integrated into Docker CLI as 'docker compose')
# The docker-ce-cli above should include 'docker compose' plugin.
# If you need the standalone 'docker-compose' (V1 syntax), you can install it:
# ARG DOCKER_COMPOSE_VERSION=1.29.2 # For standalone V1
# RUN curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
#    chmod +x /usr/local/bin/docker-compose

# Add jenkins user to the docker group.
# The GID for this 'docker' group should match the GID of the 'docker' group on the HOST.
ARG DOCKER_HOST_GID=999 # Default, override with --build-arg during docker build
RUN if getent group ${DOCKER_HOST_GID} > /dev/null 2>&1 ; then \
        echo "Group with GID ${DOCKER_HOST_GID} already exists. Will use it."; \
        EXISTING_GROUP_NAME=$(getent group ${DOCKER_HOST_GID} | cut -d: -f1); \
        if [ "$EXISTING_GROUP_NAME" != "docker" ]; then \
            echo "Warning: GID ${DOCKER_HOST_GID} is used by group '$EXISTING_GROUP_NAME', not 'docker'. Using this group."; \
            usermod -aG ${EXISTING_GROUP_NAME} jenkins; \
        else \
            usermod -aG docker jenkins; \
        fi; \
    elif getent group docker > /dev/null 2>&1 ; then \
        echo "Group 'docker' exists. Modifying its GID to ${DOCKER_HOST_GID}."; \
        groupmod -g ${DOCKER_HOST_GID} docker; \
        usermod -aG docker jenkins; \
    else \
        echo "Creating new group 'docker' with GID ${DOCKER_HOST_GID}."; \
        groupadd -g ${DOCKER_HOST_GID} docker; \
        usermod -aG docker jenkins; \
    fi

# Optional: Give jenkins sudo rights for docker if group permissions are tricky (less secure)
# RUN echo "jenkins ALL=(ALL) NOPASSWD: /usr/bin/docker" >> /etc/sudoers

# Switch back to jenkins user
USER jenkins