@echo off
keytool -genkey -v -keystore tiledrop-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias tiledrop-key -storepass Tiledrop@123 -keypass Tiledrop@123 -dname "CN=LTS,O=LTS,C=US"
pause
