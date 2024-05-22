### Relation between Collections and Products

-   **Collection:**

    -   Create + Update -> No change in products
    -   Delete collection -> Remove that collection in products

-   **Products:**
    -   Cretae Product -> add that product to collection
    -   Update collection in product -> Add or Remove that product tn collection
    -   Delete product -> remove that product in collections

### Products API

-   Get All Products = GET /api/products
-   Create Product = POST /api/products/new

-   Single Product = GET /api/products/productId
-   update Product = POST /api/products/productId
-   Delete Product = DELETE /api/products/productId
