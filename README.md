## This is a test of building a react / webRTC communication layer

This is currently a test app - not great code, etc. There are some errors being thrown right now and other things that are less than ideal. . .

## install

`npm install` || `yarn install`

## running

`npm start` || `yarn start`

1. Open two browsers to localhost:3000 (or whatever port your run the react app on -- default is 3000)
1. Set one browser host by navigating to the `/` route
1. Set one browser to be the client to connect by navigating to `/join`. You will need to input the key from the host and press Go.
1. Once connected, you should have the ability to send a random string to the peer connection

## references

It is based on the excellent simple-datachannel [git project](https://github.com/JustGoscha/simple-datachannel) -- [blog post](http://www.justgoscha.com/programming/2014/03/07/simple-webrtc-datachannel-establishment-for-dummies.html)

It is made with create react app. 
