# Palette Picker API

# Summary


## Tech Stack

Express, Knex, PostgreSQL, Heroku, TravisCI

## Endpoints

* Project Data: https://palettepicker-api.herokuapp.com/api/v1/projects
* Palette Data: https://palettepicker-api.herokuapp.com/api/v1/palettes

## API Calls

### GET

You can get data on all project and palettes saved.

### GET /api/v1/projects

#### Sample Response

```
[{
id: 1,
title: "Example 1",
created_at: "2019-08-22T19:14:02.628Z",
updated_at: "2019-08-22T19:14:02.628Z"
},
{
id: 2,
title: "Example 2",
created_at: "2019-08-22T19:14:02.628Z",
updated_at: "2019-08-22T19:14:02.628Z"
}]
```

### GET /api/v1/palettes

#### Sample Response

```
[{
id: 1,
project_id: 1,
color_1: "#403F4C",
color_2: "#E84855",
color_3: "#F9DC5C",
color_4: "#3185FC",
color_5: "#EFBCD5",
created_at: "2019-08-22T19:14:02.632Z",
updated_at: "2019-08-22T19:14:02.632Z"
},
{
id: 2,
project_id: 1,
color_1: "#B1F8F2",
color_2: "#BDC39C",
color_3: "#FFFC99",
color_4: "#EAFDCF",
color_5: "#8E8358",
created_at: "2019-08-22T19:14:02.632Z",
updated_at: "2019-08-22T19:14:02.632Z"
},
{
id: 3,
project_id: 2,
color_1: "#C9CEBD",
color_2: "#B2BCAA",
color_3: "#838E83",
color_4: "#6C6061",
color_5: "#64403E",
created_at: "2019-08-22T19:14:02.632Z",
updated_at: "2019-08-22T19:14:02.632Z"
}]
```

### GET /api/v1/projects/:id

#### Sample Response /api/v1/projects/1

```
{
id: 1,
title: "Example 1",
created_at: "2019-08-22T19:14:02.628Z",
updated_at: "2019-08-22T19:14:02.628Z"
}
```

### GET /api/v1/palettes/:id

#### Sample Response /api/v1/palettes/1

```
{
id: 1,
project_id: 1,
color_1: "#403F4C",
color_2: "#E84855",
color_3: "#F9DC5C",
color_4: "#3185FC",
color_5: "#EFBCD5",
created_at: "2019-08-22T19:14:02.632Z",
updated_at: "2019-08-22T19:14:02.632Z"
}
```


### POST /api/v1/projects
- This endpoint will allow a user to add a new project to the dataset.
- Should return a message if the project was posted successfully

** Required properties: title

### POST /api/v1/palettes
- This endpoint will allow a user to create an additional palette to the database
- Should return a message if the book was posted successfully

** Required properties: project_id, color_1, color_2, color_3, color_4, color_5

### PUT /api/v1/projects/:id
- This endpoint will allow a user to update a project
- Should return a message if the project was successfully updated

** Required properties: title

### PATCH /api/v1/palettes/:id
- This endpoint will allow a user to update a single field in a palette
- Should return a message if the palette was successfully updated

** Required properties: color_1, color_2, color_3, color_4 or color_5


### DELETE /api/v1/project/:id
- This endpoint expects an parameter to be passed in the url (id), which represents the id of a single project to be deleted
- This endpoint will also delete any palettes that correspond to it

### DELETE /api/v1/palette/:id
- This endpoint expects an parameter to be passed in the url (id), which represents the id of a single palette to be deleted
