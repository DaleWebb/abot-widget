# abot-widget
A chat widget to embed on your website to interact with the abot. [http://dalewebb.github.io/abot-widget](http://dalewebb.github.io/abot-widget)

## Install

```
$ npm install
```

## Development
This is packaged together with webpack, you will need this to compile your changes.
```
$ npm install webpack -g
```

To continuously build the widget when files have changed, run the following command.
```
$ npm run build
```

## Demo
To see the widget in action, run
```
$ npm start
```
then navigate to *http://localhost:8080* (you can change the port with `$ npm config set abot-widget:port [port]`)

## Usage

```html
<html>
  <head></head>
  <body>
    <script src="widget.js"></script>
    <script>
      abot.init({
        server: 'http://localhost:4200'//Point to the abot server
      });
    </script>
  </body>
</html>
```
