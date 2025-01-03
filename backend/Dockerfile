# Use the official PHP image with Apache
FROM php:8.1-apache

# Enable mod_rewrite for Apache
RUN a2enmod rewrite

# Install PDO extension for database access
RUN docker-php-ext-install pdo pdo_mysql

# Update and install necessary packages
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-install zip

COPY . /var/www/html
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

# Install Composer, could be improved by installing composer from the registry/artifactory, 
# but not from the machine of the person building the image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install graphQl-php
RUN composer install

RUN composer dump-autoload


# Set working directory
WORKDIR /var/www/html/src

# Expose port 80 to access the app
EXPOSE 80

# Start Apache in the foreground
CMD ["apache2-foreground"]
