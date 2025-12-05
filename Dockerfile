#
# File Name: Dockerfile
# Author: Alexandre Kévin DE FREITAS MARTINS
# Creation Date: 5/12/2025
# Description: Production Dockerfile for EpiCheck
#              Multi-stage build for optimized production deployment
# Copyright (c) 2025 Epitech
# Version: 1.0.0
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the 'Software'), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#

# Stage 1: Build
FROM --platform=linux/amd64 node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install build dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Build arguments for environment variables (must be before COPY)
ARG EXPO_PUBLIC_PROXY_URL=/api/intra-proxy
ARG BUILD_DATE
ARG GIT_COMMIT

ENV EXPO_PUBLIC_PROXY_URL=${EXPO_PUBLIC_PROXY_URL}

# Verify environment variable is set
RUN echo "Building with EXPO_PUBLIC_PROXY_URL=${EXPO_PUBLIC_PROXY_URL}" && \
    echo "Build date: ${BUILD_DATE}" && \
    echo "Git commit: ${GIT_COMMIT}"

# Copy source code
COPY . .

# Build the web version of the app for production using Metro
RUN npx expo export --platform web

# Stage 2: Production
FROM nginx:alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
