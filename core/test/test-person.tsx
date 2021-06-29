'use strict';
// Copyright TXPCo ltd, 2021
import { EmailAddress, Url, NickName, Name, Person, IPersonLoader, IPersonStorer } from '../src/Person';

var expect = require("chai").expect;

class StubLoader implements IPersonLoader {
   load(): Person {
      return new Person(1, "123", new NickName("Joester"), new Name ("Joe"),
         new EmailAddress("Joe@mail.com", true), new Url("https://jo.pics.com", false), "1234");
   }
}

class StubStorer implements IPersonStorer {
   save(person: Person) {
   }
}

describe("Name", function () {
   var name1: Name, name2: Name, name3: Name;

   beforeEach(function () {
      name1 = new Name("Joe");
      name2 = new Name("Bill");
      name3 = new Name("Joe");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(name1.equals(name1)).to.equal(true);
      expect(name1.equals(name2)).to.equal(false);
      expect(name1.equals(name3)).to.equal(true);
   });

   it("Needs to catch invalid name", function () {

      let caught = false;

      try {
         let name4 = new Name("");
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to correctly store attributes", function () {

      expect(name1.name).to.equal("Joe");
   });
});

describe("NickName", function () {
   var name1: NickName, name2: NickName, name3: NickName;

   beforeEach(function () {
      name1 = new NickName("Joe");
      name2 = new NickName("Bill");
      name3 = new NickName("Joe");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(name1.equals(name1)).to.equal(true);
      expect(name1.equals(name2)).to.equal(false);
      expect(name1.equals(name3)).to.equal(true);
   });

   it("Needs to catch invalid name", function () {

      let caught = false;

      try {
         let name4 = new NickName("");
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to correctly store attributes", function () {

      expect(name1.nickName).to.equal("Joe");
   });
});

describe("Url", function () {
   var url1: Url, url2: Url, url3: Url;

   beforeEach(function () {
      url1 = new Url("https://jo.pics.com", true);
      url2 = new Url("https://jo.pics.com", false);
      url3 = new Url("https://jo.pics.com", false);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(url1.equals(url1)).to.equal(true);
      expect(url1.equals(url2)).to.equal(false);
      expect(url1.equals(url3)).to.equal(false);
   });

   it("Needs to catch invalid url", function () {

      let caught = false;

      try {
         let email4 = new Url("11", false);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });


   it("Needs to catch empty url", function () {

      let caught = false;

      try {
         let email4 = new Url("", false);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to correctly store attributes", function () {

      expect(url1.url).to.equal("https://jo.pics.com");
      expect(url1.isUrlVerified).to.equal(true);
   });
});

describe("EmailAddress", function () {
   var email1: EmailAddress, email2: EmailAddress, email3: EmailAddress;

   beforeEach(function () {
      email1 = new EmailAddress("Joe@mail.com", true);
      email2 = new EmailAddress("Joe@mail.com", false);
      email3 = new EmailAddress("Joe@mail.com", false);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(email1.equals(email1)).to.equal(true);
      expect(email1.equals(email2)).to.equal(false);
      expect(email1.equals(email3)).to.equal(false);
   });

   it("Needs to catch invalid email address", function () {

      let caught = false;

      try {
         let email4 = new EmailAddress("Joe", false);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to catch empty email address", function () {

      let caught = false;

      try {
         let email4 = new EmailAddress("", false);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to correctly store attributes", function () {

      expect(email1.email).to.equal("Joe@mail.com");
      expect(email1.isEmailVerified).to.equal(true);
   });
});

describe("Person", function () {
   var person1, person2;
   
   beforeEach(function () {
      person1 = new Person(1, "123", new NickName("Joester"), new Name("Joe"),
         new EmailAddress("Joe@mail.com", true), new Url ("https://jo.pics.com", false), "1234");

      person2 = new Person(2, "123", new NickName("Joedog"), new Name("Joe"),
         new EmailAddress ("Joe@mail.com", true), new Url ("https://jo.pics.com", false), "5678");
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(person1.equals(person1)).to.equal(true);
      expect(person1.equals(person2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {
      
      expect(person1.id).to.equal(1);    
      expect(person1.externalId).to.equal("123");
      expect(person1.nickName.equals (new NickName ("Joester"))).to.equal (true);
      expect(person1.name.equals(new Name("Joe"))).to.equal(true);
      expect(person1.email.equals(new EmailAddress("Joe@mail.com", true))).to.equal(true);
      expect(person1.thumbnailUrl.equals(new Url("https://jo.pics.com", false))).to.equal(true);
      expect(person1.authCode).to.equal("1234");
   });

   it("Needs to correctly change attributes", function () {

      let newMail = new EmailAddress("new@New.com", false);
      let newUrl = new Url("https://jo.newpics.com", false);
      let newName = new Name("NewJoe");
      let newNickName = new NickName("NewJoe");
      person1.email = newMail;
      person1.thumbnailUrl = newUrl;
      person1.name = newName;
      person1.nickName = newNickName;

      expect(person1.email).to.equal(newMail);
      expect(person1.thumbnailUrl).to.equal(newUrl);
      expect(person1.name).to.equal(newName);
      expect(person1.nickName).to.equal(newNickName);
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
         storer.save(new Person(1, "123", new NickName("Joester"), new Name("Joe"),
            new EmailAddress("Joe@mail.com", true), new Url("https://jo.pics.com", false), "1234"));
      } catch {
         caught = true;
      }

      expect(caught).to.equal(false);

   });

});