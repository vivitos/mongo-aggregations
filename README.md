## Getting started
This project is built with [Mono](https://mono.js.org/#/).

```bash
git clone https://github.com/vivitos/mongo-aggregations.git
cd mongo-aggregations
npm install
```

Don't forget to configure your MongoDB url and your dbName in configurations files in the /conf folder. For more information on configuration file [click here](https://mono.js.org/#/configuration).


__DON'T FORGET TO CHANGE YOUR JWT SECRET KEY IN CONF FILES__

Then, depending on your environment, run the following command

```bash
# Development
npm run dev

# Production
npm start
```

## Routes

### Users
+ ```POST /users/signup```
    + Body :
    ```javascript
    {
        "email": "user@domain.com",
        "password": "myPassword"
    }
    ```
    + Response:
    ```javascript
    {
        "token": "jwtToken" //Expired in seven days by default, you can configure it in conf files
    }
    ```

+ ```POST /users/signin```
    + Body :
    ```javascript
    {
        "email": "user@domain.com",
        "password": "myPassword"
    }
    ```
    + Response:
    ```javascript
    {
        "token": "jwtToken" //Expired in seven days by default, you can configure it in conf files
    }
    ```

### Aggregations

+ ```POST /users/signin```
    + Body:
   ```javascript
    {
        "shouldMatch": { // Match one of the following conditions
            "date": { // My field (date as example)
                "between": ["greatestThanOrEqual", "lighterThanOrEqual"] // Match all values between head and tail of the array
            },
            "myField": "matchingPattern" // Match the pattern
        },
        "mustMatch": { // Match all of the conditions
            "myNumericalField": 0, // Work with all kind of fields
            "anotherField": {
                "in": ["firstPattern", "secondPattern", "thirdPattern"] // Match an array element
            }
        },

        // If you want to do more than one aggregations at a time, you should use 'aggregations'.
        // It works like other aggregations. See examples
        "aggregations": {
            "myFirstAggregation": { // First aggregation
                "mustMatch": {
                "myNumericalField": 0,
                "anotherField": {
                    "in": ["firstPattern", "secondPattern", "thirdPattern"]
                    }
                },
                "sort": "sortField", // Sort aggregation
                "unwind": "unwindField", // Unwind the aggregation
                "group": {
                    "dimensions": ["dim1", "dim2"], // The dimensions to group (string or array)
                    "sumBy": ["value", "unit"] // The dimension to sum (string or array)
                }
            },
             "mySecondAggregation": { // Second aggregation
                "mustMatch": {
                "myNumericalField": 0,
                "anotherField": {
                    "in": ["firstPattern", "secondPattern", "thirdPattern"]
                    }
                },
                "sort": "sortField",
                "unwind": "unwindField",
                "group": {
                    "dimensions": ["toGroup1", "toGroup2"],
                    "sumBy": ["value", "unit"]
                }
            }
        }
    }
    ```
    + Response: Your mongodb aggregation

## Examples
### Query Simple Model
```javascript
{
	"shouldMatch": {
		"date": {
			"between": ["greatestThanOrEqual", "lighterThanOrEqual"]
		},
		"myField": "matchingPattern"
	},
	"mustMatch": {
		"myNumericalField": 0,
		"anotherField": {
			"in": ["firstPattern", "secondPattern", "thirdPattern"]
		}
	},
	"sort": "sortField",
	"unwind": "unwindField"
}
```
This will generate the query below :
```javascript
[
    {
        "$match": {
            "$or": [
                {
                    "date": {
                        "$gte": "greatestThanOrEqual",
                        "$lte": "lighterThanOrEqual"
                    }
                },
                {
                    "myField": "matchingPattern"
                }
            ]
        }
    },
    {
        "$match": {
            "$and": [
                {
                    "myNumericalField": 0
                },
                {
                    "anotherField": {
                        "$in": [
                            "firstPattern",
                            "secondPattern",
                            "thirdPattern"
                        ]
                    }
                }
            ]
        }
    },
    {
        "$sort": "sortField"
    },
    {
        "$unwind": "$unwindField"
    }
]
```
---

### Query Multiple Aggregations Model

```javascript
{
	"mustMatch": {
		"myNumericalField": 0,
		"anotherField": {
			"in": ["firstPattern", "secondPattern", "thirdPattern"]
		}
	},
	"aggregations": {
		"firstFacetsAggregation": {
			"mustMatch": {
			"myNumericalField": 0,
			"anotherField": {
				"in": ["firstPattern", "secondPattern", "thirdPattern"]
				}
			}
		}
	},
	"group": {
		"dimensions": ["toGroup1", "toGroup2"],
		"sumBy": ["value", "unit"]
	}
}
```

This will generate and execute the query below :
```javascript
[
    {
        "$match": {
            "$and": [
                {
                    "myNumericalField": 0
                },
                {
                    "anotherField": {
                        "$in": [
                            "firstPattern",
                            "secondPattern",
                            "thirdPattern"
                        ]
                    }
                }
            ]
        }
    },
    {
        "$group": {
            "_id": {
                "toGroup1": "$toGroup1",
                "toGroup2": "$toGroup2"
            },
            "value": {
                "$sum": "$value"
            },
            "unit": {
                "$sum": "$unit"
            }
        }
    },
    {
        "$facet": {
            "firstFacetsAggregation": [
                {
                    "$match": {
                        "$and": [
                            {
                                "myNumericalField": 0
                            },
                            {
                                "anotherField": {
                                    "$in": [
                                        "firstPattern",
                                        "secondPattern",
                                        "thirdPattern"
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
]
```