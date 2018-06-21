# Query Simple Model
```json
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
```json
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

# Query Multiple Aggregations Model

```json
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

This will generate the query below :
```json
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