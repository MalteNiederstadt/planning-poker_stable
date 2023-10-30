# Django settings for example project.
import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DEBUG = os.getenv('DEBUG', '0').lower() in ['true', 't', '1']
#DEBUG = True
TEMPLATE_DEBUG = DEBUG
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS').split(' ')

SECRET_KEY = os.getenv('SECRET_KEY')

TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, 'planning_poker/templates'),
)

ASGI_APPLICATION = 'example.asgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.environ.get('DATABASE_NAME'),
        'USER':  os.environ.get('DATABASE_USERNAME'),
        'PASSWORD':  os.environ.get('DATABASE_PASSWORD'),
        'HOST':  os.environ.get('DATABASE_HOST'),
        'PORT':  os.environ.get('DATABASE_PORT'),
    }
}

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.humanize',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.admindocs',
    'channels',
    'planning_poker.apps.ChannelsPresenceConfig',
    'planning_poker',
)

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    }
]

ROOT_URLCONF = 'example.urls'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = os.path.join(os.path.dirname(BASE_DIR), 'static')

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    # 'django.contrib.staticfiles.finders.DefaultStorageFinder',
)


# Please note, that the in-memory layer should not be used in production.
# Instead install and use the channels-redis layers backend.
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("red-ckiig7ce1qns73fk1vcg", 6379)],
        },
    },
}
LOGIN_URL = 'admin:login'
LOGOUT_URL = 'admin:logout'

FIELD_ENCRYPTION_KEYS = [SECRET_KEY.encode().hex()[:64]]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'