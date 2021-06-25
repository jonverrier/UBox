'use strict';
// Copyright TXPCo ltd, 2021
import { Person, IPersonLoader, IPersonStorer } from '../src/Person';

var expect = require("chai").expect;

class StubLoader implements IPersonLoader {
   load(): Person {
      return new Person(1, "123", "Joester", "Joe", "Joe@mail.com", true, "https://jo.pics.com", "1234");
   }
}

class StubStorer implements IPersonStorer {
   save(person: Person) {
   }
}

describe("Person", function () {
   var person1, person2;
   
   beforeEach(function () {
      person1 = new Person(1, "123", "Joester", "Joe", "Joe@mail.com", true, "https://jo.pics.com", "1234");

      person2 = new Person(2, "123", "Joedog", "Joe", "Joe@mail.com", true, "https://jo.pics.com", "5678");
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(person1.equals(person1)).to.equal(true);
      expect(person1.equals(person2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {
      
      expect(person1.id).to.equal(1);    
      expect(person1.externalId).to.equal("123");
      expect(person1.alias).to.equal("Joester");
      expect(person1.name).to.equal("Joe");
      expect(person1.email).to.equal("Joe@mail.com");
      expect(person1.isEmailVerified).to.equal(true);
      expect(person1.thumbnailUrl).to.equal("https://jo.pics.com");
      expect(person1.authCode).to.equal("1234");
   });
});

describe("PersonLoader", function () {

   it("Needs to load a Person.", function () {

      let loader = new StubLoader;

      let person = loader.load();

      expect(person).to.not.equal(null);
   });

});

describe("PersonStorer", function () {

   it("Needs to save a Person.", function () {

      let storer = new StubStorer;
      let caught = false;

      try {
         storer.save(new Person(1, "123", "Joester", "Joe", "Joe@mail.com", true, "https://jo.pics.com", "1234"));
      } catch {
         caught = true;
      }

      expect(caught).to.equal(false);

   });

});