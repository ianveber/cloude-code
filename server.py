import http.server
import socketserver

PORT = 3000
DIR  = "/Users/ianveber/Desktop/Cloude CODE"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def log_message(self, format, *args):
        pass  # silence request logs

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
