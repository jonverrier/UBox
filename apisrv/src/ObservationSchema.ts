'use strict';
// Copyright TXPCo ltd, 2020, 2021
// Implements IMeasurementStore over a Mongo DB schema

import mongoose from "mongoose";
import { EBaseUnitDimension, EBaseUnit } from '../../core/src/Unit';
import { EMeasurementType, EPositiveTrend } from '../../core/src/ObservationType';
import { persistenceDetailsSchema } from './PersistenceSchema';


const measurementTypeValues: Array<string> = (Object.values(EMeasurementType));
const measurementUnitTypeValues: Array<string> = (Object.values(EBaseUnitDimension));
const trendValues: Array<string> = (Object.values(EPositiveTrend));

const baseUnitDemensions: Array<string> = (Object.values(EBaseUnitDimension));
const baseUnits: Array<string> = (Object.values(EBaseUnit));

export const quantitySchema = new mongoose.Schema({
   _amount: {
      type: Number,
      required: true
   },
   _unit: {
      _dimension: {
         type: String,
         enum: baseUnitDemensions,
         required: true
      },
      _name: {
         type: String,
         enum: baseUnits,
         required: true
      }
   }
});

export const rangeSchema = new mongoose.Schema({
   _lo: quantitySchema,
   _loInclEq: {
      type: Boolean,
      required: true
   },
   _hi: quantitySchema,
   _hiInclEq: {
      type: Boolean,
      required: true
   },
});

export const measurementTypeSchema = new mongoose.Schema({
   _measurementType: {
      type: String,
      enum: measurementTypeValues,
      required: true
   },
   _unitType: {
      type: String,
      enum: measurementUnitTypeValues,
      required: true
   }, 
   _range: rangeSchema,
   _trend: {
      type: String,
      enum: trendValues,
      required: true
   }
});

export const measurementSchema = new mongoose.Schema({
   _persistenceDetails: persistenceDetailsSchema,
   _quantity: quantitySchema,
   _repeats: {
      type: Number,
      required: true
   },
   _timestamp: {
       type: Number,
       required: true
   },
   _measurementType: {
      type: String,
      required: true
   },
   _subjectKey: {
      type: String,
      required: true
   },
   _cohortKey: {
      type: String,
      required: true
   }
},
{  // Enable timestamps for archival 
      timestamps: true
   });

measurementSchema.set('toObject', {
   transform: function (doc, ret) {
      // Copy the _id into the persistenceCetails structure. 
      ret._persistenceDetails._key = doc._id.toString();
      return ret;
   }
});

// Additional indices - by name of the persona, and by email
measurementSchema.index({ _subjectKey: 1 });
measurementSchema.index({ _cohortKey: 1 }); 

export const measurementModel = mongoose.model("Measurement", measurementSchema);
