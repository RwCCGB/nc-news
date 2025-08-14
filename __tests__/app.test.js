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

describe("GET /api/articles/:article_id", () =>{
  test("200: Responds with correct article information based on ID", ()=>{
    let article_id = 1
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({body}) =>{
        expect(body).toHaveProperty("article")
        expect(body.article).toHaveProperty("article_id", 1)
      }).catch((err) => {
        console.log("Error: ", err)
        throw err
      })
  })

  test("400: Responds with Invalid article ID when sent not a number for ID", ()=>{
    return request(app)
      .get("/api/articles/helloWorld")
      .expect(400)
      .then(({body})=>{
        expect(body.msg).toBe("Invalid article id")
      })
  })
  test("404: Reponds with Not Found for article with incorrect ID", ()=>{
    return request(app)
        .get("/api/articles/1000000000")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("Not Found")
        })
  })
})

describe("GET /api/articles/:article_id/comments", ()=>{
  test("200: Responds with comments based on article ID in correct order", ()=>{
    let article_id = 1
    let expectedArticleId = 1
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({body}) =>{
        expect(Array.isArray(body.comments)).toBe(true)
    
        }).catch((err) => {
          if(err.res){
              console.log("Status ", err.response.status)
              console.log("Body ", err.response.body)
              console.log("Full ", err)
          }
          throw err
        })
    })
    test("400: Responds with error when not a valid article ID", ()=>{
      return request(app)
        .get("/api/articles/HelloWorld/comments")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Invalid article id")
        })
    })
    test("404: Responds with error when not an article is not found", ()=>{
      return request(app)
        .get("/api/articles/1000000/comments")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("article not found")
        })
    })
  })

  describe("POST /api/articles/:article_id/comments", ()=>{
    test("201: Responds with a success and the message", ()=>{
      const newCommnet = {username: "lurker", body: "This is an epic comment"}
      const article_id = 1

      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newCommnet)
        .expect(201)
        .then(({body}) =>{
          const comment = body.comment
          expect(comment.author).toBe("lurker")
          expect(comment.body).toBe("This is an epic comment")
          expect(comment.article_id).toBe(article_id)
        })      
    })
    test("400: Responds with not found when not sent a comment", ()=>{
      const newCommnet = {username: "lurker"}
      const article_id = 1

      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newCommnet)
        .expect(400)
        .then(({body}) =>{
          expect(body.msg).toBe("Missing username or comment")
        })      
    })
    test("404: Responds with not found when username not found", ()=>{
      const newCommnet = {username: "lurkerNotHere", body: "My epic comment"}
      const article_id = 1

      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newCommnet)
        .expect(404)
        .then(({body}) =>{
          expect(body.msg).toBe("User not found")
        })      
    })
  })

  describe("PATCH /api/articles/:article_id", ()=>{
    test("200: Responds OK when vote incremented and returns updated article", () =>{
      return request(app)
        .patch("/api/articles/1")
        .send({inc_votes: 1})
        .expect(200)
        .then(({body}) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            votes: expect.any(Number),
          })
        })
    })
    test("400: Responds with 400  when article ID is invalid", ()=>{
        return request(app)
          .patch("/api/articles/HelloWorld")
          .send({inc_votes: 1})
          .expect(400)
          .then(({body}) =>{
            expect(body.msg).toBe("Invalid article id")
          })
    })

    test("400: Responds with 404 when inc_votes is missing", () =>{
      return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(400)
          .then(({body}) =>{
            expect(body.msg).toBe("Invalid vote type")
          })
    })
    test("400: Respond with 400 when inc_votes is not a number", ()=>{
      return request(app)
          .patch("/api/articles/1")
          .send({inc_votes: "votingrules"})
          .expect(400)
          .then(({body}) =>{
            expect(body.msg).toBe("Invalid vote type")
          })
    })
    test("404: Responds with not found when article_id does not exist", () =>{
      return request(app)
      .patch("/api/articles/1000000000")
      .send({inc_votes: 1})
      .expect(404)
      .then(({body}) =>{
        expect(body.msg).toBe("Article not found")
      })
    })
  })

  describe("DELETE: /api/comments/:comment_id", () =>{
    test("204: Responds with 204 when deleting a comment by comment_id", ()=>{
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
    })
    test("400: Responds with 400 when invalid comment_id", ()=>{
      return request(app)
        .delete("/api/comments/HelloWorld")
        .expect(400)
        .then(({body}) =>{
          expect(body.msg).toBe("Invalid comment_id")
        })
    })
    test("404: Responds 404 when comment not found", ()=>{
      return request(app)
        .delete("/api/comments/100000000")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("Comment not found")
        })
    })
  })
  describe('GET /api/articles (topic query)', () => {
    test('200: returns all articles when no topic is supplied', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true)
          expect(body.articles.length).toBeGreaterThan(0)
          body.articles.forEach((a) => {
            expect(a).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
              })
            )
          })
        })
    })
  })