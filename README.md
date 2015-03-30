# RequestSlug
Put this slug on your local machine. Change the request URL to localhost/what/ever. Review what is actually sent to that remote server which is not responing as expected.

## usage
Create (self signed) certificates for the https part of the slug:
    ./generate_ssl_keys
Unleash the slug:
	sudo npm start

Any call to localhost will cause the slug to print what is recieved and respond with { request: 'slug' }
