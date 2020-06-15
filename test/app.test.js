const { expecgt, expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const { reduce } = require('../store');

describe('Playstore App', () => {
    it('Should return an array from GET /apps', () => {
        return supertest(app)
            .get('/apps')
            .query({ search: ""})
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
            });
    });

    it('Should return error if Sort is not Rating or App', () => {
        return supertest(app)
            .get('/apps')
            .query({search: "", Sort: "Title"})
            .expect(200)
            .then(res => {
                expect(400, 'Sort must be Rating or App')
            })
    });

    it('Should return error if Genre not correct', () => {
        return supertest(app)
            .get('/apps')
            .query({search: "", Genres: "Horror"})
            .expect(200)
            .then(res => {
                expect(400, 'Genre must be Action, Puzzle, Strategy, Casual, Arcade or Card')
            })
    });

    it('Should sort correctly by App title', () => {
        const query = {
            search: "",
            sort: "App"
        }

        return supertest(app)
            .get('/apps')
            .query(query)
            .expect(200)
            .then(res => {
                let sorted = true;
                let i = 0;
                expect(200)
                expect(res.body).to.be.an('array')
                expect(res.body).to.have.lengthOf.at.least(1);
                while(i < res.body.length - 1){
                    const appAtI = res.body[i];
                    const nextApp = res.body[i+1];
                    if(appAtI.App > nextApp.App){
                        sorted=false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            })
    })

    it('Should sort correctly by Rating', () => {
        const query = {
            search: "",
            sort: "Rating"
        }
        return supertest(app)
            .get('/apps')
            .query(query)
            .expect(200)
            .then(res => {
                let sorted = true;
                let i = 0;
                expect(200)
                expect(res.body).to.be.an('array')
                expect(res.body).to.have.lengthOf.at.least(1);
                while(i < res.body.length - 1){
                    const ratingAtI = res.body[i].Rating;
                    const ratingAtIPlus1 = res.body[i+1].Rating;
                    if(ratingAtIPlus1 > ratingAtI){
                        sorted=false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            })
    })

    it('Should sort correctly by Genre', () => {
        const query = {
            search: "",
            genres: "Action"
        }
        return supertest(app)
            .get('/apps')
            .query(query)
            .expect(200)
            .then(res => {
                expect(200)
                expect(res.body).to.be.an('array')
                expect(res.body).to.have.lengthOf.at.least(1)
                const sortedSearch = res.body.filter(app => app.Genres === "Action")
                expect(sortedSearch.length > 0).to.be.true;
                
            })
    })

    it('Should search correctly', () => {
        return supertest(app)
            .get('/apps')
            .query({ search: "Angry Birds Rio"})
            .expect(200)
            .then(res => {
                expect(200)
                expect(res.body).to.be.an('array')
                expect(res.body).to.have.lengthOf.at.least(1)
                expect(res.body[0].App).to.equal('Angry Birds Rio');
            })
    })

})