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
          //expect(typeof article.body).toBe('string')
          expect(typeof article.created_at).toBe('string')
          expect(typeof article.votes).toBe('number')
          expect(typeof article.article_img_url).toBe('string')
        })
      })
  })

  test("200: Articles returns list with total comment count, sorted by date (desc) and no body using a JOIN", () =>{
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body : {articles}}) => {
        expect(articles.length).not.toBe(0)

        articles.forEach((article) =>{
          // already tested for types so no need to repeat, just check that no property of body
          expect(article.body).toBe(undefined)
        })
        // Validate the date time against the order 
        console.log(articles)
        for (let i = 0; i < articles.length -1; i++){
          const currentDate = new Date(articles[i].created_at).getTime()
          const nextDate = new Date(articles[i + 1].created_at).getTime()  
          expect(currentDate).toBeGreaterThanOrEqual(nextDate)
        }
      })
  })
  test.skip("ERR Add error handling checks", ()=>{

  })     
});

describe("GET /api/topics", ()=>{
  test("200: Responds with OK status code", () =>{
    return request(app)
      .get("/api/topics")
      .expect(200)
  })

  test("200: Responds with topics", () => {
    return request(app)
      .get('/api/topics')
      .expect(200) 
      .then(({ body: {topics} }) => {
        expect(topics.length).not.toBe(0)
        topics.forEach((topic) => { 
          expect(typeof topic.slug).toBe('string')
          expect(typeof topic.description).toBe('string')
          
        })
      })
  }) 
  test.skip("ERR Add error handling checks", ()=>{

  })     
})

describe("GET /api/users", () =>{
  test("200: Responds with OK status", () =>{
    return request(app)
      .get('/api/users')
      .expect(200)
  })

  test("200: Responds with OK status and list of users", ()=>{
    return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
          expect(body.users.length).toBeGreaterThan(0)
        
          body.users.forEach((user) =>{
            expect(typeof user.username).toBe("string")
            expect(typeof user.name).toBe("string")
            expect(typeof user.avatar_url).toBe("string")
          })
        
        })
  })

  test.skip("ERR: Responds with an error, TBC", () =>{

  })
})
