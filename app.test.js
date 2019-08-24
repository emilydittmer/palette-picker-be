const request = require("supertest");
const app = require("./app");
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);
const cmd = require("node-cmd");

describe("Server", () => {
  describe("init", () => {
    it("should return a 200 status", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
    });
  });
});
describe("API", () => {
  beforeEach(() => {
    cmd.run(" npx knex seed:run");
  });
  describe("GET /api/v1/projects", () => {
    it("should return a status of 200 and all projects", async () => {
      const expectedProjects = await database("projects")
        .first()
        .then(project => [project.title, project.id]);

      const response = await request(app).get("/api/v1/projects");
      const project = response.body[0];

      expect(response.status).toBe(200);
      expect([project.title, project.id]).toEqual(expectedProjects);
    });
  });

  describe("GET /api/v1/palettes", () => {
    it("should return a status of 200 and all palettes", async () => {
      const expectedPallete = await database("palettes")
        .first()
        .then(palette => [
          palette.id,
          palette.project_id,
          palette.color_1,
          palette.color_2,
          palette.color_3,
          palette.color_4,
          palette.color_5
        ]);
      const response = await request(app).get("/api/v1/palettes");
      const palette = response.body[0];
      const testedPalette = [
        palette.id,
        palette.project_id,
        palette.color_1,
        palette.color_2,
        palette.color_3,
        palette.color_4,
        palette.color_5
      ];

      expect(response.status).toBe(200);
      expect(testedPalette).toEqual(expectedPallete);
    });
  });

  describe("GET /api/v1/projects/:id", () => {
    it("should return a status of 200 and one project by its id", async () => {
      const expectedProjectId = await database("projects")
        .first()
        .then(project => project.id);

      const response = await request(app).get("/api/v1/projects/1");
      const project = response.body.id;

      expect(response.status).toBe(200);
      expect(project).toEqual(expectedProjectId);
    });

    it("should return a 404 error if cannot find project by id", async () => {
      const expected = "ERROR: Cannot find project id";

      const response = await request(app).get("/api/v1/projects/200");
      const project = response.body;

      expect(response.status).toBe(404);
      expect(project).toEqual(expected);
    });
  });

  describe("GET /api/v1/projects/:id/palettes", () => {
    it('should return a 200 status and all palettes with the same project_id', async () => {
      const expectedProjectId = await database('projects')
        .first()
        .then(project => project.id);
      const expectedPalettes = await database('palettes').where({ project_id:expectedProjectId }).select();

      const response = await request(app).get(`/api/v1/projects/${expectedProjectId}/palettes`);
      const palettes = response.body;

      expect(response.status).toBe(200)
      expect(palettes[0].color_1).toEqual(expectedPalettes[0].color_1)
    })

    it('should return a 404 status if cannot find a project by an id', async () => {
      const response = await request(app).get("/api/v1/projects/400/palettes")

      expect(response.status).toBe(404);
    })
  })

  describe(" GET /api/v1/palettes/:id", () => {
    it("should return a status of 200 and one palette by the id", async () => {
      const expectedPaletteId = await database("palettes")
        .first()
        .then(palette => palette.id);

      const response = await request(app).get("/api/v1/palettes/1");
      const palette = response.body.id;

      expect(response.status).toBe(200);
      expect(palette).toEqual(expectedPaletteId);
    });

    it("should return a status of 404 if cant find a palette by id", async () => {
      const expectedResponse = "ERROR: Cannot find palette id";

      const response = await request(app).get("/api/v1/palettes/200");
      const palette = response.body;

      expect(response.status).toBe(404);
      expect(palette).toEqual(expectedResponse);
    });
  });

  describe("POST /api/v1/projects", () => {
    it("should return a response of 201 and the object", async () => {
      const newProject = {
        title: "New Project"
      };
      const response = await request(app)
        .post("/api/v1/projects")
        .send(newProject);
      const project = response.body.id;
      const id = await database("projects").max("id");

      console.log(id);
      expect(response.status).toBe(201);
      expect(project).toEqual(id[0].max);
    });

    it("should return a status of 422 and error message if missing information", async () => {
      const newProject = {};

      const response = await request(app)
        .post("/api/v1/projects")
        .send(newProject);
      const project = response.body;
      expect(response.status).toBe(422);
      expect(project).toEqual({
        Error:
          "Your new project was not added. You are missing the title property"
      });
    });
  });

  describe("POST /api/v1/palettes", () => {
    it("should return a 201 status and the object", async () => {
      const newPalette = {
        color_1: "red",
        color_2: "red",
        color_3: "red",
        color_4: "red",
        color_5: "red",
        project_id: 1
      };

      const response = await request(app)
        .post("/api/v1/palettes")
        .send(newPalette);
      const paletteId = response.body.id;
      const maxId = await database("palettes").max("id");

      expect(response.status).toBe(201);
      expect(paletteId).toEqual(maxId[0].max);
    });

    it("should return a 422 status and error message if missing parameter", async () => {
      const newPalette = {};

      const response = await request(app)
        .post("/api/v1/palettes")
        .send(newPalette);
      const errorMsg = response.body;
      const expectedError = {
        Error:
          "Your new project was not added. You are missing the project_id property"
      };

      expect(response.status).toBe(422);
      expect(errorMsg).toEqual(expectedError);
    });
  });

  describe("PUT /api/v1/projects/:id", () => {
    it("should return a 202 status and the project object", async () => {
      const newProject = {
        title: "New Project"
      };

      const response = await request(app)
        .put("/api/v1/projects/2")
        .send(newProject);
      const project = response.body;
      const putProject = await database("projects")
        .first()
        .then(project => project.id);

      expect(response.status).toBe(202);
      expect(project).toEqual(putProject);
    });

    it("should return a 422 status and error message if missing the title", async () => {
      const newProject = {};

      const response = await request(app)
        .put("/api/v1/projects/2")
        .send(newProject);
      const error = response.body;
      const expectedError = {
        Error: `Your new project was not updated. You are missing the title property`
      };

      expect(response.status).toBe(422);
      expect(error).toEqual(expectedError);
    });

    it("should return a 404 status if the id does not exist", async () => {
      const newProject = {
        title: "New Project"
      };

      const response = await request(app)
        .put("/api/v1/projects/-1")
        .send(newProject);

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/v1/palettes/:id", () => {
    it("should return a 422 status if a property is missing in the patch", async () => {
      const { id } = await database("palettes").first("id");
      const requestBody = {};

      const response = await request(app)
        .patch(`/api/v1/palettes/${id}`)
        .send(requestBody);

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual(
        `Your new project was not updated. You are missing the  property`
      );
    });

    it("should return a 202 status if palette has been updated", async () => {
      const { id } = await database("palettes").first("id");
      const requestBody = { color_1: "#ffffff" };

      const response = await request(app)
        .patch(`/api/v1/palettes/${id}`)
        .send(requestBody);

      expect(response.status).toBe(202);
    });

    it("should return a 404 status if palette could not be updated", async () => {
      const requestBody = { color_1: "#ffffff" };

      const response = await request(app)
        .patch(`/api/v1/palettes/-1`)
        .send(requestBody);
      const error = response.body;

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /projects/:id", () => {
    it("should return a 204 error and the delete project", async () => {
      const response = await request(app).delete(`/api/v1/projects/1`);

      expect(response.status).toBe(204);
    });

    it("should return a 404 error if a project was not deleted", async () => {
      const response = await request(app).delete("/api/v1/project/0");

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /palettes/:id", () => {
    it("should return a 204 and the delete palette", async () => {
      const { id } = await database("palettes").first("id");
      const response = await request(app).delete(`/api/v1/palettes/${id}`);

      expect(response.status).toBe(204);
    });

    it("should return a 404 error if a palette was not deleted", async () => {
      const response = await request(app).delete("/api/v1/palettes/0");

      expect(response.status).toBe(404);
    });
  });
});
