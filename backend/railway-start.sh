#!/bin/sh

# Railway startup script for Laravel

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
  php artisan key:generate --force
fi

# Cache config for production performance
php artisan config:cache
php artisan route:cache

# Run database migrations, then seed (seeder skips if data already exists)
php artisan migrate --force
php artisan db:seed --force

# Serve the application on the port Railway provides
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
