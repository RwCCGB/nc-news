const endpointsJson = require("../endpoints.json");
const request = require("supertest")
const app = require("../app.js")
const data = require("../db/data/test-data")
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")

beforeEach(() => {
  return seed(data)
})

afterAll(() => { 
 return db.end()
})

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects", () => { 
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => { 
        expect(body.articles.length).not.toBe(0)
        body.articles.forEach((article) => { 
          expect(typeof article.article_id).toBe('number')
          expect(typeof article.title).toBe('string')
          expect(typeof article.topic).toBe('string')
          expect(typeof article.author).toBe('string')
          expect(typeof article.body).toBe('string')
          expect(typeof article.created_at).toBe('string')
          expect(typeof article.votes).toBe('number')
          expect(typeof article.article_img_url).toBe('string')
        })
      })
  })
});