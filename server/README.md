# System Desing Capstone - Item Reviews CRUD API Documentation

## Create a new Review

ENDPOINT : `/api/reviews`

TYPE : `POST`

Status : `201`

Response : `application/json`

## Retrieve all Reviews of a specific product

ENDPOINT : `/api/product/:productId/reviews`

TYPE : `GET`

Status : `200`

Response : `application/json`

## Retrieve a single Review by Id

ENDPOINT : `/api/reviews/:id`

TYPE : `GET`

Status : `200`

Response : `application/json`

## Update a Review with Id

ENDPOINT : `/api/reviews/:id`

TYPE : `PUT`

Status : `201`

Response : `application/json`

## Delete a Review with Id

ENDPOINT : `/api/reviews/:id`

TYPE : `DELETE`

Status : `201`

Response : `application/json`