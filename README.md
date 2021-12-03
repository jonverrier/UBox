# UltraBox

## UltraBox - Table of Contents
* [General info](#general-info)
* [Modules](#modules)
* [Technologies](#technologies)
* [Licence](#licence)

## General info
UltraBox creates tools to help boutique gym operators create engaging online experiences for their members. 

Work in progress for a multi-user app to support:
- Whiteboards - an electronic equivalent to a trditional crossfit whiteboard - where you write up the Workout of the day, and note your member's scores through the day. The whieboard can then be shared via a URL at the end of the day.
- Cohort-based training - such as an 8-week PowerLifting block, with metrics defined by  lifts such as deadlift, back squat, bench. 
- Throwdowns, where participants from multiple gyms complete the same series of workouts though heats to final.

## Modules
- Core - all domain logic. No dependencies on Node, or on front end frameworks. Pure typescript. 
- Apisrv - Node.js server, serves both status content pages and the APIs used by the web app & mobile apps.
- UIWeb - a react.js web app end for the Whiteboard application 
- UIApp (not started) - a React native front end for the Whiteboard application. 


## Technologies
Typescript & IOTS on server and client, Node.js & Mongo DB on server. 
Bootstrap for web front end, React.js for the web app, React native for apps

## Licence

MIT.




