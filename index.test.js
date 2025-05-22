const request = require("supertest");
const app = require("./src/app");
const db = require("./db/connection");
const Restaurant = require("./models/index");
const req = require("express/lib/request");

beforeAll(async() =>{
    await db.sync({ force:true});
    await Restaurant.bulkCreate([
        {name: "Pizza Palace", location: "New York", cuisine: "Italian"},
        {name: "Sushi", location: "Tokyo", cuisine: "Japanese"},
    ]);
});


afterAll(async () => {
  await db.close();
});

describe("Restaurant API", () => {
  test("GET /restaurants returns status 200", async () => {
    const res = await request(app).get("/restaurants");
    expect(res.statusCode).toBe(200);
  });

  test("GET /restaurants returns an array", async () => {
    const res = await request(app).get("/restaurants");
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /restaurants returns correct number of restaurants", async () => {
    const res = await request(app).get("/restaurants");
    expect(res.body.length).toBe(2);
  });

  test("GET /restaurants returns correct restaurant data", async () => {
    const res = await request(app).get("/restaurants");
    expect(res.body[0].name).toBe("Pizza Palace");
  });

  test("GET /restaurants/:id returns correct restaurant", async () => {
    const res = await request(app).get("/restaurants/1");
    expect(res.body.name).toBe("Pizza Palace");
  });

  test("POST /restaurants creates a new restaurant", async () => {
    const newRestaurant = {
      name: "Burger Bonanza",
      location: "Texas",
      cuisine: "American",
    };
    const res = await request(app).post("/restaurants").send(newRestaurant);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Burger Bonanza");

    // Verify it's added
    const all = await request(app).get("/restaurants");
    expect(all.body.length).toBe(3);
  });

  test("PUT /restaurants/:id updates a restaurant", async () => {
    const res = await request(app)
      .put("/restaurants/1")
      .send({ name: "Pizza Castle" });
    expect(res.body.name).toBe("Pizza Castle");


    const check = await request(app).get("/restaurants/1");
    expect(check.body.name).toBe("Pizza Castle");
  });

  test("DELETE /restaurants/:id removes a restaurant", async () => {
    const res = await request(app).delete("/restaurants/1");
    expect(res.body.message).toBe("Restaurant deleted successfully");


    const check = await request(app).get("/restaurants/1");
    expect(check.statusCode).toBe(404);
  });
  
  test("POST /restaurants returns errors if name is empty", async () => {
    const res = await request(app)
      .post("/restaurants")
      .send({ name: "", location: "Texas", cuisine: "American" });
  
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "name" }),
      ])
    );
  });
  
  test("POST /restaurants returns errors if location is empty", async () => {
    const res = await request(app)
      .post("/restaurants")
      .send({ name: "Burger Bonanza", location: " ", cuisine: "American" });
  
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "location" }),
      ])
    );
  });
  
  test("POST /restaurants returns errors if cuisine is empty", async () => {
    const res = await request(app)
      .post("/restaurants")
      .send({ name: "Burger Bonanza", location: "Texas", cuisine: "" });
  
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "cuisine" }),
      ])
    );
  });
  
});