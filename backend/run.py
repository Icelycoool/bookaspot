from config import ProdConfig
from main import create_app

app = create_app(ProdConfig)

if __name__ == "__main__":
    app.run()
