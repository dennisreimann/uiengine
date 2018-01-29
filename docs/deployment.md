# Deployment

As the output of the [default theme](./theme.md) is a single-page website, the deployment requires some server configuration.

Without a proper server configuration, the users will get a 404 error if they access pages ther than the homepage directly in their browser.
To fix the issue, all you need to do is add a simple catch-all fallback route to your server.
If the URL doesn't match any static assets, it should serve the same index.html page that your UIengine output lives in.

Here you can find some examples.

## nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Apache

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Express with Node.js

For Node.js/Express, consider using [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback) middleware.

## Native Node.js

```js
const { createServer } = require('http')
const { readFile } = require('fs')
const PORT = 80

createServer((req, res) => {
  readFile('index.html', 'utf-8', (err, content) => {
    if (err) {
      console.error('Cannot open "index.html" file.')
    }

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    })

    res.end(content)
  })
}).listen(PORT, () => {
  console.log('Server listening on: http://localhost:%s', PORT)
})
```
