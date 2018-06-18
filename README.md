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