DONE

03/11/20
+create table thickness
+add unique value for thickness
+update table product field thickness
+add to table product new fields: stage, terms_and_limitations

///
+manual update thickness in product table on prod*

+migrate title(values) from application table to category table
+migrate thickness data to json format
+migrate width data to json format
+migrate height data to json format

+update table application field thickness
+update table application field width
+update table application field height
+add to table application field additional_features
+add to table application field type
+add to table application field stage
+add to table application field terms_and_limitations

TODO

-manual create Measure Unit     level 1 in category table on prod*
-manual create Territories      level 1 in category table on prod*
-manual create Printing Method  level 1 in category table on prod*
-manual create Partners         level 1 in category table on prod*

-add to table application column printing_method    type JSONB DEFAULT '[]'
-add to table application column partner_name       type integer[]
-add to table application column production_site    type character varying(255)
-add to table application column notes_area         type text

-add to table product column printing_method        type JSONB DEFAULT '[]'
-add to table product column available_territories  type JSONB DEFAULT '[]'
-add to table product column moq                    type JSONB DEFAULT '[]'
-add to table product column partner_name           type integer[]
-add to table product column production_site        type character varying(255)
-add to table product column notes_area             type text


