export interface ITrackDetails {
	[index: number]: {
		Name: string;
		Layouts: {
			[index: number]: {
				Name: string;
				BoxEntrance: number;
			};
		};
	};
}

export const trackDetails: ITrackDetails = {
	262: {
		Name: 'RaceRoom Raceway',
		Layouts: {
			263: {
				Name: 'Grand Prix',
				BoxEntrance: 3623.65
			},
			264: {
				Name: 'Classic',
				BoxEntrance: 3666.306
			},
			265: {
				Name: 'Classic Sprint',
				BoxEntrance: 3432.903
			},
			266: {
				Name: 'Bridge',
				BoxEntrance: 3179.678
			},
			267: {
				Name: 'National',
				BoxEntrance: 3411.678
			}
		}
	},
	1670: {
		Name: 'Monza Circuit',
		Layouts: {
			1671: {
				Name: 'Grand Prix',
				BoxEntrance: 5386.326
			},
			1672: {
				Name: 'Junior',
				BoxEntrance: 2020.565
			}
		}
	},
	1673: {
		Name: 'Mid Ohio',
		Layouts: {
			1674: {
				Name: 'Full',
				BoxEntrance: 3669.081
			},
			1675: {
				Name: 'Short',
				BoxEntrance: 2726.058
			},
			1676: {
				Name: 'Chicane',
				BoxEntrance: 3656.664
			}
		}
	},
	1677: {
		Name: 'Circuit Zandvoort',
		Layouts: {
			1678: {
				Name: 'Grand Prix',
				BoxEntrance: 4211.43
			},
			1679: {
				Name: 'Club',
				BoxEntrance: 2442.249
			},
			1680: {
				Name: 'National',
				BoxEntrance: 2821.688
			}
		}
	},
	1683: {
		Name: 'Circuit Zolder',
		Layouts: {
			1684: {
				Name: 'Grand Prix',
				BoxEntrance: 3774.185
			}
		}
	},
	1690: {
		Name: 'Nürburgring',
		Layouts: {
			1691: {
				Name: 'Grand Prix',
				BoxEntrance: 4981.249
			},
			2010: {
				Name: 'Grand Prix Fast Chicane',
				BoxEntrance: 4971.286
			},
			2011: {
				Name: 'Sprint Fast Chicane',
				BoxEntrance: 3454.771
			},
			3377: {
				Name: 'Sprint',
				BoxEntrance: 3467.658
			}
		}
	},
	1692: {
		Name: 'Hockenheinring',
		Layouts: {
			1693: {
				Name: 'Grand Prix',
				BoxEntrance: 4499.352
			},
			1763: {
				Name: 'National',
				BoxEntrance: 3626.74
			},
			1764: {
				Name: 'Short',
				BoxEntrance: 2525.206
			}
		}
	},
	1771: {
		Name: 'Portimao Circuit',
		Layouts: {
			1778: {
				Name: 'Grand Prix',
				BoxEntrance: 4290.04
			},
			1783: {
				Name: 'National',
				BoxEntrance: 3814.41
			},
			1784: {
				Name: 'Club',
				BoxEntrance: 3549.634
			},
			1785: {
				Name: 'Club Chicane',
				BoxEntrance: 3547.868
			}
		}
	},
	1840: {
		Name: 'Suzuka Circuit',
		Layouts: {
			1841: {
				Name: 'Grand Prix',
				BoxEntrance: 5465.189
			},
			2012: {
				Name: 'East Course',
				BoxEntrance: 1892.078
			},
			2013: {
				Name: 'West Course',
				BoxEntrance: 3462.627
			}
		}
	},
	1845: {
		Name: 'Bathurst Circuit',
		Layouts: {
			1846: {
				Name: 'Mount Panorama',
				BoxEntrance: 6013.166
			}
		}
	},
	1849: {
		Name: 'Imola',
		Layouts: {
			1850: {
				Name: 'Grand Prix',
				BoxEntrance: 4584.86
			}
		}
	},
	1851: {
		Name: 'Indianapolis 2012',
		Layouts: {
			1852: {
				Name: 'Grand Prix',
				BoxEntrance: 3777.198
			},
			2014: {
				Name: 'Moto',
				BoxEntrance: 3993.803
			}
		}
	},
	1853: {
		Name: 'Sonoma Raceway',
		Layouts: {
			1854: {
				Name: 'WTCC',
				BoxEntrance: 3729.735
			},
			2016: {
				Name: 'Sprint',
				BoxEntrance: 2836.436
			},
			3912: {
				Name: 'Long',
				BoxEntrance: 3674.054
			},
			3913: {
				Name: 'IRL',
				BoxEntrance: 3523.214
			}
		}
	},
	1855: {
		Name: 'WeatherTech Raceway Laguna Seca',
		Layouts: {
			1856: {
				Name: 'Grand Prix',
				BoxEntrance: 3228.581
			}
		}
	},
	1865: {
		Name: 'Hungaroring',
		Layouts: {
			1866: {
				Name: 'Grand Prix',
				BoxEntrance: 4274.952
			}
		}
	},
	2020: {
		Name: 'Salzburgring',
		Layouts: {
			2026: {
				Name: 'Grand Prix',
				BoxEntrance: 30.932
			}
		}
	},
	2021: {
		Name: 'Shanghai Circuit',
		Layouts: {
			2027: {
				Name: 'Grand Prix',
				BoxEntrance: 5277.96
			},
			4041: {
				Name: 'Intermediate (WTCC)',
				BoxEntrance: 4427.832
			},
			4042: {
				Name: 'West Long',
				BoxEntrance: 2729.547
			}
		}
	},
	2029: {
		Name: 'Slovakia Ring',
		Layouts: {
			2064: {
				Name: 'Grand Prix',
				BoxEntrance: 5736.993
			}
		}
	},
	2122: {
		Name: 'Macau',
		Layouts: {
			2123: {
				Name: 'Grand Prix',
				BoxEntrance: 5998.139
			}
		}
	},
	2383: {
		Name: 'Motorsport Arena Oschersleben',
		Layouts: {
			2384: {
				Name: 'A Course',
				BoxEntrance: 3601.264
			},
			7753: {
				Name: 'B Course',
				BoxEntrance: 2334.939
			},
			7754: {
				Name: 'Motorcycle A Course',
				BoxEntrance: 3583.944
			},
			7755: {
				Name: 'Motorcycle B Course',
				BoxEntrance: 2316.87
			}
		}
	},
	2467: {
		Name: 'DEKRA Lausitzring',
		Layouts: {
			2468: {
				Name: 'DTM Short Course',
				BoxEntrance: 3166.363
			},
			3291: {
				Name: 'Short Course',
				BoxEntrance: 3139.267
			},
			6166: {
				Name: 'Grand Prix Course',
				BoxEntrance: 4270.364
			},
			9055: {
				Name: 'DTM Grand Prix Course',
				BoxEntrance: 4306.76
			},
			10328: {
				Name: 'GP Course Oval T1',
				BoxEntrance: 4365.00
			}
		}
	},
	2472: {
		Name: 'Moscow Raceway',
		Layouts: {
			2473: {
				Name: 'Sprint',
				BoxEntrance: 2334.445
			},
			3383: {
				Name: 'Full',
				BoxEntrance: 3750.572
			},
			3683: {
				Name: 'FIM',
				BoxEntrance: 3724.498
			}
		}
	},
	2517: {
		Name: 'Norisring',
		Layouts: {
			2518: {
				Name: 'Grand Prix',
				BoxEntrance: 1853.333
			}
		}
	},
	2519: {
		Name: 'Brands Hatch Indy',
		Layouts: {
			2520: {
				Name: 'Indy',
				BoxEntrance: 1709.672
			}
		}
	},
	2521: {
		Name: 'Red Bull Ring Spielberg',
		Layouts: {
			2556: {
				Name: 'Grand Prix Circuit',
				BoxEntrance: 4084.74
			},
			5794: {
				Name: 'Südschleife National Circuit',
				BoxEntrance: 2106.269
			}
		}
	},
	2812: {
		Name: 'Nordschleife',
		Layouts: {
			2813: {
				Name: 'Nordschleife',
				BoxEntrance: 20616.648
			},
			4975: {
				Name: 'VLN',
				BoxEntrance: 24191.092
			},
			5095: {
				Name: '24 Hours',
				BoxEntrance: 25228.719
			}
		}
	},
	2866: {
		Name: 'Paul Ricard',
		Layouts: {
			2867: {
				Name: 'Solution 3C',
				BoxEntrance: 3729.108
			},
			4246: {
				Name: 'Solution 1A',
				BoxEntrance: 5656.714
			},
			4247: {
				Name: 'Solution 1C-V2',
				BoxEntrance: 5749.761
			},
			4248: {
				Name: 'Solution 2A short',
				BoxEntrance: 3359.38
			}
		}
	},
	3463: {
		Name: 'Zhuhai Circuit',
		Layouts: {
			3464: {
				Name: 'Grand Prix',
				BoxEntrance: 4056.495
			}
		}
	},
	3537: {
		Name: 'Sachsenring',
		Layouts: {
			3538: {
				Name: 'Grand Prix',
				BoxEntrance: 3418.687
			}
		}
	},
	3869: {
		Name: 'Spa-Francorchamps',
		Layouts: {
			3870: {
				Name: 'Grand Prix',
				BoxEntrance: 6816.451
			},
			4542: {
				Name: 'Classic',
				BoxEntrance: 6794.85
			},
			4543: {
				Name: 'Combined',
				BoxEntrance: 6156.96
			}
		}
	},
	4038: {
		Name: 'Silverstone Circuit',
		Layouts: {
			4039: {
				Name: 'Grand Prix',
				BoxEntrance: 5549.604
			},
			5816: {
				Name: 'International',
				BoxEntrance: 2637.498
			},
			5817: {
				Name: 'National',
				BoxEntrance: 2321.412
			},
			5862: {
				Name: 'Historic Grand Prix',
				BoxEntrance: 5530.501
			}
		}
	},
	4252: {
		Name: 'Chang International Circuit',
		Layouts: {
			4253: {
				Name: 'Full Circuit',
				BoxEntrance: 4316.221
			},
			4944: {
				Name: 'D Circuit',
				BoxEntrance: 2882.847
			}
		}
	},
	5275: {
		Name: 'Road America',
		Layouts: {
			5276: {
				Name: 'Grand Prix',
				BoxEntrance: 6277.746
			}
		}
	},
	5297: {
		Name: 'Automotodrom Brno',
		Layouts: {
			5298: {
				Name: 'Gand Prix',
				BoxEntrance: 5309.26
			},
			9796: {
				Name: 'Grand Prix (Short Pit Entry)',
				BoxEntrance: 5315.119
			}
		}
	},
	5300: {
		Name: 'Scandinavian Raceway',
		Layouts: {
			5301: {
				Name: 'Grand Prix',
				BoxEntrance: 3772.593
			},
			6164: {
				Name: 'South',
				BoxEntrance: 1637.027
			}
		}
	},
	5924: {
		Name: 'Gelleråsen Arena',
		Layouts: {
			5925: {
				Name: 'Grand Prix Circuit',
				BoxEntrance: 2118.112
			},
			6138: {
				Name: 'Short Circuit',
				BoxEntrance: 916.565
			}
		}
	},
	6009: {
		Name: 'Mantorp Park',
		Layouts: {
			6010: {
				Name: 'Long Circuit',
				BoxEntrance: 2918.843
			},
			6167: {
				Name: 'Short Circuit',
				BoxEntrance: 1711.121
			}
		}
	},
	6053: {
		Name: 'Stowe Circuit',
		Layouts: {
			6055: {
				Name: 'Long',
				BoxEntrance: 1589.914
			},
			6056: {
				Name: 'Short',
				BoxEntrance: 1166.519
			}
		}
	},
	6136: {
		Name: 'Knutstorp Ring',
		Layouts: {
			6137: {
				Name: 'GP',
				BoxEntrance: 1986.477
			}
		}
	},
	6139: {
		Name: 'Falkenberg Motorbana',
		Layouts: {
			6140: {
				Name: 'Grand Prix',
				BoxEntrance: 1670.172
			}
		}
	},
	6340: {
		Name: 'Sepang',
		Layouts: {
			6341: {
				Name: 'Grand Prix',
				BoxEntrance: 5490.183
			},
			6578: {
				Name: 'North',
				BoxEntrance: 2746.914
			},
			6579: {
				Name: 'South',
				BoxEntrance: 2355.011
			}
		}
	},
	6586: {
		Name: 'Dubai Autodrome',
		Layouts: {
			6587: {
				Name: 'Grand Prix Circuit',
				BoxEntrance: 5137.459
			},
			7976: {
				Name: 'Club Circuit',
				BoxEntrance: 2300.165
			},
			7977: {
				Name: 'National Circuit',
				BoxEntrance: 3350.327
			},
			7978: {
				Name: 'International Circuit',
				BoxEntrance: 4093.47
			}
		}
	},
	6657: {
		Name: 'Twin Ring Motegi',
		Layouts: {
			6658: {
				Name: 'Road Course',
				BoxEntrance: 4419.811
			},
			7026: {
				Name: 'West Course',
				BoxEntrance: 1190.289
			},
			7027: {
				Name: 'East Course',
				BoxEntrance: 3145.26
			}
		}
	},
	7111: {
		Name: 'Autodrom Most',
		Layouts: {
			7112: {
				Name: 'Grand Prix',
				BoxEntrance: 3999.728
			}
		}
	},
	7272: {
		Name: 'Ningbo International Speedpark',
		Layouts: {
			7273: {
				Name: 'Full circuit',
				BoxEntrance: 3712.927
			},
			8309: {
				Name: 'Full circuit no chicane',
				BoxEntrance: 3673.881
			},
			8310: {
				Name: 'Intermediate circuit',
				BoxEntrance: 3256.535
			},
			8311: {
				Name: 'Intermediate circuit no chicane',
				BoxEntrance: 3220.594
			},
			8314: {
				Name: 'Short circuit',
				BoxEntrance: 1591.777
			}
		}
	},
	7818: {
		Name: 'Bilsterberg',
		Layouts: {
			7819: {
				Name: 'Gesamtstrecke',
				BoxEntrance: 3974.256
			},
			8069: {
				Name: 'Gesamtstrecke Schikane',
				BoxEntrance: 4007.352
			},
			8070: {
				Name: 'Ostschleife',
				BoxEntrance: 2362.983
			},
			8071: {
				Name: 'Ostschleife Schikane',
				BoxEntrance: 2380.17
			},
			8095: {
				Name: 'Westschleife',
				BoxEntrance: 1649.783
			}
		}
	},
	8074: {
		Name: 'Zhejiang Circuit',
		Layouts: {
			8075: {
				Name: 'Grand Prix',
				BoxEntrance: 3006.783
			},
			8327: {
				Name: 'East circuit',
				BoxEntrance: 1388.557
			}
		}
	},
	8366: {
		Name: 'Daytona International Speedway',
		Layouts: {
			8367: {
				Name: 'Road Course',
				BoxEntrance: 5515.575
			},
			8648: {
				Name: 'Speedway (Not Supported)',
				BoxEntrance: 3797.999
			},
			8655: {
				Name: 'Road Course Motorcycle (2006)',
				BoxEntrance: 4535.723
			}
		}
	},
	8703: {
		Name: 'Motorland Aragón',
		Layouts: {
			8704: {
				Name: 'Grand Prix',
				BoxEntrance: 5132.51
			},
			9040: {
				Name: 'Motorcycle Grand Prix',
				BoxEntrance: 4865.084
			},
			9041: {
				Name: 'National',
				BoxEntrance: 2430.538
			},
			9042: {
				Name: 'Motorcycle National',
				BoxEntrance: 2165.433
			},
			9043: {
				Name: 'Fast Circuit',
				BoxEntrance: 4720.391
			}
		}
	},
	9176: {
		Name: 'Watkins Glen International',
		Layouts: {
			9177: {
				Name: 'Short with Inner loop',
				BoxEntrance: 3691.728
			},
			9324: {
				Name: 'Grand Prix with Inner Loop',
				BoxEntrance: 5211.27
			},
			9343: {
				Name: 'Short Circuit',
				BoxEntrance: 3674.475
			},
			9344: {
				Name: 'Grand Prix',
				BoxEntrance: 5207.028
			}
		}
	},
	9464: {
		Name: 'Vålerbanen',
		Layouts: {
			9465: {
				Name: 'Full Circuit',
				BoxEntrance: 2077.614
			}
		}
	},
	9472: {
		Name: 'Brands Hatch Grand Prix',
		Layouts: {
			9473: {
				Name: 'Grand Prix',
				BoxEntrance: 3705.171
			}
		}
	},
	12419: {
		Name: 'AVUS',
		Layouts: {
			12500: {
				Name: '1994',
				BoxEntrance: 2340
			},
			12420: {
				Name: '1998',
				BoxEntrance: 2345
			}
		}
	},
	12936: {
		Name: 'Alemanenring',
		Layouts: {
			12938: {
				Name: 'Full Circuit',
				BoxEntrance: 2506
			}
		}
	},
	11904: {
		Name: 'Circuit de Pau-Ville',
		Layouts: {
			11905: {
				Name: 'Grand Prix',
				BoxEntrance: 13
			}
		}
	},
	10393: {
		Name: 'Donington Park',
		Layouts: {
			10394: {
				Name: 'Grand Prix',
				BoxEntrance: 3864
			},
			10725: {
				Name: 'National',
				BoxEntrance: 3062
			}
		}
	},
	10903: {
		Name: 'Circuit de Charade',
		Layouts: {
			10904: {
				Name: 'Grand Prix',
				BoxEntrance: 3698
			},
			11908: {
				Name: 'Classic Racing School',
				BoxEntrance: 3698
			}
		}
	},
	10781: {
		Name: 'Circuit Zandvoort',
		Layouts: {
			10782: {
				Name: 'Grand Prix',
				BoxEntrance: 4153
			},
			11090: {
				Name: 'Short',
				BoxEntrance: 2753
			}
		}
	},
	2018: {
		Name: 'Estoril Circuit',
		Layouts: {
			2024: {
				Name: 'Grand Prix',
				BoxEntrance: 4008
			},
			12318: {
				Name: 'Tanque',
				BoxEntrance: 3979
			}
		}
	},
	12394: {
		Name: 'Fliegerhorst Diepholz',
		Layouts: {
			12395: {
				Name: 'Full Circuit',
				BoxEntrance: 2656
			}
		}
	},
	12111: {
		Name: 'Hockenheimring Classic',
		Layouts: {
			12112: {
				Name: 'Grand Prix',
				BoxEntrance: 6718
			},
			12236: {
				Name: 'Short',
				BoxEntrance: 2551
			}
		}
	},
	10462: {
		Name: 'Interlagos',
		Layouts: {
			10463: {
				Name: 'Grand Prix',
				BoxEntrance: 4144
			}
		}
	}
};

export function getCornerName(layoutId: number, lDist: number) {
	// Autodromo Most
	if (layoutId === 7112) {
		if (lDist >= 3964 || lDist <= 430) { return 'Start-Finish'; }
		if (lDist >= 460 && lDist <= 540) { return 'Turn 1'; }
		if (lDist >= 541 && lDist <= 625) { return 'Turn 2'; }
		if (lDist >= 675 && lDist <= 770) { return 'Turn 3'; }
		if (lDist >= 771 && lDist <= 1050) { return 'Turn 4'; }
		if (lDist >= 1100 && lDist <= 1190) { return 'Turn 5'; }
		if (lDist >= 1200 && lDist <= 1285) { return 'Turn 6'; }
		if (lDist >= 1286 && lDist <= 1374) { return 'Turn 7'; }
		if (lDist >= 1375 && lDist <= 1440) { return 'Turn 8'; }
		if (lDist >= 1441 && lDist <= 1515) { return 'Turn 9'; }
		if (lDist >= 1525 && lDist <= 1680) { return 'Turn 10'; }
		if (lDist >= 1715 && lDist <= 1815) { return 'Turn 11'; }
		if (lDist >= 1880 && lDist <= 1990) { return 'Turn 12'; }
		if (lDist >= 2125 && lDist <= 2275) { return 'Turn 13'; }
		if (lDist >= 2370 && lDist <= 2500) { return 'Turn 14'; }
		if (lDist >= 2585 && lDist <= 2725) { return 'Turn 15'; }
		if (lDist >= 2726 && lDist <= 2880) { return 'Turn 16'; }
		if (lDist >= 2890 && lDist <= 3030) { return 'Turn 17'; }
		if (lDist >= 3090 && lDist <= 3205) { return 'Turn 18'; }
		if (lDist >= 3295 && lDist <= 3410) { return 'Turn 19'; }
		if (lDist >= 3570 && lDist <= 3730) { return 'Turn 20'; }
		if (lDist >= 3765 && lDist <= 3963) { return 'Turn 21'; }

		// BATHURST
	} else if (layoutId === 1846) {
		if (lDist >= 6001 || lDist <= 157) { return 'Start-Finish'; }
		if (lDist >= 158 && lDist <= 334) { return 'Hell Corner'; }
		if (lDist >= 350 && lDist <= 1150) { return 'Mountain Straight'; }
		if (lDist >= 1230 && lDist <= 1560) { return 'Griffins Bend'; }
		if (lDist >= 1650 && lDist <= 1940) { return 'The Cutting'; }
		if (lDist >= 2060 && lDist <= 2260) { return 'Quarry Corner'; }
		if (lDist >= 2261 && lDist <= 2360) { return 'Reid Park'; }
		if (lDist >= 2361 && lDist <= 2480) { return 'Frog Hollow'; }
		if (lDist >= 2481 && lDist <= 2660) { return 'Sulman Park'; }
		if (lDist >= 2730 && lDist <= 2930) { return 'McPhillamy Park'; }
		if (lDist >= 2931 && lDist <= 3110) { return 'Skyline'; }
		if (lDist >= 3111 && lDist <= 3635) { return 'The Esses'; }
		if (lDist >= 3636 && lDist <= 3830) { return 'The Dipper'; }
		if (lDist >= 3890 && lDist <= 4020) { return 'Forrest´s Elbow'; }
		if (lDist >= 4070 && lDist <= 4985) { return 'Conrod Straight'; }
		if (lDist >= 5000 && lDist <= 5600) { return 'The Chase'; }
		if (lDist >= 5820 && lDist <= 6000) { return 'Murrays Corner'; }

		// Bilster Berg Gesamtstrecke
	} else if (layoutId === 7819) {
		if (lDist >= 3870 || lDist <= 142) { return 'Start-Finish'; }
		if (lDist >= 143 && lDist <= 261) { return 'Kugelkopf'; }
		if (lDist >= 262 && lDist <= 338) { return 'Fledermaushügel'; }
		if (lDist >= 412 && lDist <= 514) { return 'Pumpenhaus'; }
		if (lDist >= 515 && lDist <= 633) { return 'Munitionsfeld'; }
		if (lDist >= 780 && lDist <= 850) { return 'Jägerbuche'; }
		if (lDist >= 851 && lDist <= 954) { return 'Driburger Lichtung'; }
		if (lDist >= 955 && lDist <= 1060) { return 'Hermannsschneise'; }
		if (lDist >= 1084 && lDist <= 1206) { return 'Sauwechsel'; }
		if (lDist >= 1245 && lDist <= 1372) { return 'Telegrafenbogen'; }
		if (lDist >= 1373 && lDist <= 1479) { return 'Kommandatur'; }
		if (lDist >= 1480 && lDist <= 1675) { return 'Mausefalle'; }
		if (lDist >= 1676 && lDist <= 1834) { return 'Steilwand'; }
		if (lDist >= 1835 && lDist <= 2075) { return 'Bilster Kuppe'; }
		if (lDist >= 2076 && lDist <= 2201) { return 'Hochsitz'; }
		if (lDist >= 2202 && lDist <= 2340) { return 'Clubhaus-S'; }
		if (lDist >= 2341 && lDist <= 2904) { return 'Pömbser Höhe'; }
		if (lDist >= 2905 && lDist <= 3274) { return 'Mutkurve'; }
		if (lDist >= 3275 && lDist <= 3452) { return 'Nieheimer Senke'; }
		if (lDist >= 3453 && lDist <= 3676) { return 'Hügelgrab'; }
		if (lDist >= 3677 && lDist <= 3869) { return 'Oeynhausen-Kehre'; }

		// Bilster Berg Gesamtstrecke Schikane
	} else if (layoutId === 8069) {
		if (lDist >= 3892 || lDist <= 142) { return 'Start-Finish'; }
		if (lDist >= 143 && lDist <= 261) { return 'Kugelkopf'; }
		if (lDist >= 262 && lDist <= 338) { return 'Fledermaushügel'; }
		if (lDist >= 412 && lDist <= 514) { return 'Pumpenhaus'; }
		if (lDist >= 515 && lDist <= 633) { return 'Munitionsfeld'; }
		if (lDist >= 780 && lDist <= 850) { return 'Jägerbuche'; }
		if (lDist >= 851 && lDist <= 954) { return 'Driburger Lichtung'; }
		if (lDist >= 955 && lDist <= 1060) { return 'Hermannsschneise'; }
		if (lDist >= 1084 && lDist <= 1206) { return 'Sauwechsel'; }
		if (lDist >= 1245 && lDist <= 1372) { return 'Telegrafenbogen'; }
		if (lDist >= 1373 && lDist <= 1479) { return 'Kommandatur'; }
		if (lDist >= 1480 && lDist <= 1675) { return 'Mausefalle'; }
		if (lDist >= 1676 && lDist <= 1834) { return 'Steilwand'; }
		if (lDist >= 1835 && lDist <= 2075) { return 'Bilster Kuppe'; }
		if (lDist >= 2076 && lDist <= 2201) { return 'Hochsitz'; }
		if (lDist >= 2202 && lDist <= 2340) { return 'Clubhaus-S'; }
		if (lDist >= 2341 && lDist <= 2758) { return 'Pömbser Höhe'; }
		if (lDist >= 2759 && lDist <= 2928) { return 'Schikane'; }
		if (lDist >= 2929 && lDist <= 3298) { return 'Mutkurve'; }
		if (lDist >= 3299 && lDist <= 3474) { return 'Nieheimer Senke'; }
		if (lDist >= 3475 && lDist <= 3698) { return 'Hügelgrab'; }
		if (lDist >= 3699 && lDist <= 3891) { return 'Oeynhausen-Kehre'; }

		// Bilster Berg Ostschleife
	} else if (layoutId === 8070) {
		if (lDist >= 2338 || lDist <= 142) { return 'Start-Finish'; }
		if (lDist >= 143 && lDist <= 261) { return 'Kugelkopf'; }
		if (lDist >= 262 && lDist <= 338) { return 'Fledermaushügel'; }
		if (lDist >= 412 && lDist <= 514) { return 'Pumpenhaus'; }
		if (lDist >= 515 && lDist <= 633) { return 'Munitionsfeld'; }
		if (lDist >= 860 && lDist <= 1275) { return 'Pömbser Höhe'; }
		if (lDist >= 1276 && lDist <= 1645) { return 'Mutkurve'; }
		if (lDist >= 1646 && lDist <= 1821) { return 'Nieheimer Senke'; }
		if (lDist >= 1822 && lDist <= 2144) { return 'Hügelgrab'; }
		if (lDist >= 2145 && lDist <= 2337) { return 'Oeynhausen-Kehre'; }

		// Bilster Berg Ostschleife Schikane
	} else if (layoutId === 8071) {
		if (lDist >= 2272 || lDist <= 142) { return 'Start-Finish'; }
		if (lDist >= 143 && lDist <= 261) { return 'Kugelkopf'; }
		if (lDist >= 262 && lDist <= 338) { return 'Fledermaushügel'; }
		if (lDist >= 412 && lDist <= 514) { return 'Pumpenhaus'; }
		if (lDist >= 515 && lDist <= 633) { return 'Munitionsfeld'; }
		if (lDist >= 860 && lDist <= 1128) { return 'Pömbser Höhe'; }
		if (lDist >= 1129 && lDist <= 1298) { return 'Schikane'; }
		if (lDist >= 1299 && lDist <= 1668) { return 'Mutkurve'; }
		if (lDist >= 1669 && lDist <= 1844) { return 'Nieheimer Senke'; }
		if (lDist >= 1855 && lDist <= 2078) { return 'Hügelgrab'; }
		if (lDist >= 2079 && lDist <= 2271) { return 'Oeynhausen-Kehre'; }

		// Bilster Berg Westschleife
	} else if (layoutId === 8095) {
		if (lDist >= 1533 || lDist <= 40) { return 'Start-Finish'; }
		if (lDist >= 41 && lDist <= 160) { return 'Hochsitz'; }
		if (lDist >= 161 && lDist <= 308) { return 'Clubhaus-S'; }
		if (lDist >= 450 && lDist <= 561) { return 'Driburger Lichtung'; }
		if (lDist >= 562 && lDist <= 667) { return 'Hermannsschneise'; }
		if (lDist >= 691 && lDist <= 813) { return 'Sauwechsel'; }
		if (lDist >= 850 && lDist <= 977) { return 'Telegrafenbogen'; }
		if (lDist >= 978 && lDist <= 1085) { return 'Kommandatur'; }
		if (lDist >= 1086 && lDist <= 1284) { return 'Mausefalle'; }
		if (lDist >= 1285 && lDist <= 1445) { return 'Steilwand'; }
		if (lDist >= 1446 && lDist <= 1532) { return 'Bilster Kuppe'; }

		// Brands Hatch Indy
	} else if (layoutId === 2520) {
		if (lDist >= 1600 || lDist <= 104) { return 'Start-Finish'; }
		if (lDist >= 191 && lDist <= 410) { return 'Paddock Hill Bend'; }
		if (lDist >= 411 && lDist <= 554) { return 'Hailwoods Hill'; }
		if (lDist >= 555 && lDist <= 714) { return 'Druids'; }
		if (lDist >= 715 && lDist <= 800) { return 'Graham Hill'; }
		if (lDist >= 850 && lDist <= 944) { return 'Graham Hill Bend'; }
		if (lDist >= 950 && lDist <= 1171) { return 'Cooper Straight'; }
		if (lDist >= 1172 && lDist <= 1289) { return 'Surtees'; }
		if (lDist >= 1290 && lDist <= 1431) { return 'McLaren'; }
		if (lDist >= 1432 && lDist <= 1495) { return 'Clearways'; }
		if (lDist >= 1496 && lDist <= 1599) { return 'Clark Curve'; }

		// Brands Hatch Grand Prix
	} else if (layoutId === 9473) {
		if (lDist >= 3593 || lDist <= 104) { return 'Start-Finish'; }
		if (lDist >= 191 && lDist <= 410) { return 'Paddock Hill Bend'; }
		if (lDist >= 411 && lDist <= 554) { return 'Hailwoods Hill'; }
		if (lDist >= 555 && lDist <= 714) { return 'Druids'; }
		if (lDist >= 715 && lDist <= 800) { return 'Graham Hill'; }
		if (lDist >= 850 && lDist <= 944) { return 'Graham Hill Bend'; }
		if (lDist >= 950 && lDist <= 1171) { return 'Cooper Straight'; }
		if (lDist >= 1172 && lDist <= 1371) { return 'Surtees'; }
		if (lDist >= 1640 && lDist <= 1896) { return 'Pilgrims Drop'; }
		if (lDist >= 1897 && lDist <= 1990) { return 'Hawthorn Hill'; }
		if (lDist >= 1991 && lDist <= 2170) { return 'Hawthorns'; }
		if (lDist >= 2171 && lDist <= 2344) { return 'Derek Minter Straight'; }
		if (lDist >= 2355 && lDist <= 2525) { return 'Westfield'; }
		if (lDist >= 2535 && lDist <= 2645) { return 'Dingle Dell'; }
		if (lDist >= 2755 && lDist <= 2890) { return 'Sheene Curve'; }
		if (lDist >= 2980 && lDist <= 3100) { return 'Stirlings'; }
		if (lDist >= 3373 && lDist <= 3485) { return 'Clearways'; }
		if (lDist >= 3487 && lDist <= 3595) { return 'Clark Curve'; }

		// Brno
	} else if (layoutId === 5298) {
		if (lDist >= 5210 || lDist <= 249) { return 'Start-Finish'; }
		if (lDist >= 435 && lDist <= 780) { return 'Turn 1'; }
		if (lDist >= 781 && lDist <= 925) { return 'Turn 2'; }
		if (lDist >= 1388 && lDist <= 1525) { return 'Turn 3'; }
		if (lDist >= 1605 && lDist <= 1750) { return 'Turn 4'; }
		if (lDist >= 2170 && lDist <= 2318) { return 'Turn 5'; }
		if (lDist >= 2370 && lDist <= 2470) { return 'Turn 6'; }
		if (lDist >= 2515 && lDist <= 2707) { return 'Turn 7'; }
		if (lDist >= 2863 && lDist <= 2992) { return 'Turn 8'; }
		if (lDist >= 2993 && lDist <= 3165) { return 'Turn 9'; }
		if (lDist >= 3655 && lDist <= 3875) { return 'Turn 10'; }
		if (lDist >= 4075 && lDist <= 4205) { return 'Turn 11'; }
		if (lDist >= 4206 && lDist <= 4330) { return 'Turn 12'; }
		if (lDist >= 4830 && lDist <= 4935) { return 'Turn 13'; }
		if (lDist >= 4974 && lDist <= 5184) { return 'Turn 14'; }

		// Brno
	} else if (layoutId === 9796) {
		if (lDist >= 5210 || lDist <= 249) { return 'Start-Finish'; }
		if (lDist >= 435 && lDist <= 780) { return 'Turn 1'; }
		if (lDist >= 781 && lDist <= 925) { return 'Turn 2'; }
		if (lDist >= 1388 && lDist <= 1525) { return 'Turn 3'; }
		if (lDist >= 1605 && lDist <= 1750) { return 'Turn 4'; }
		if (lDist >= 2170 && lDist <= 2318) { return 'Turn 5'; }
		if (lDist >= 2370 && lDist <= 2470) { return 'Turn 6'; }
		if (lDist >= 2515 && lDist <= 2707) { return 'Turn 7'; }
		if (lDist >= 2863 && lDist <= 2992) { return 'Turn 8'; }
		if (lDist >= 2993 && lDist <= 3165) { return 'Turn 9'; }
		if (lDist >= 3655 && lDist <= 3875) { return 'Turn 10'; }
		if (lDist >= 4075 && lDist <= 4205) { return 'Turn 11'; }
		if (lDist >= 4206 && lDist <= 4330) { return 'Turn 12'; }
		if (lDist >= 4830 && lDist <= 4935) { return 'Turn 13'; }
		if (lDist >= 4974 && lDist <= 5184) { return 'Turn 14'; }

		// Chang International Circuit - D Circuit
	} else if (layoutId === 4944) {
		if (lDist >= 2965 || lDist <= 50) { return 'Start-Finish'; }
		if (lDist >= 195 && lDist <= 330) { return 'Turn 1'; }
		if (lDist >= 740 && lDist <= 970) { return 'Turn 2'; }
		if (lDist >= 1180 && lDist <= 1460) { return 'Turn 3'; }
		if (lDist >= 2100 && lDist <= 2305) { return 'Turn 4'; }
		if (lDist >= 2415 && lDist <= 2525) { return 'Turn 5'; }
		if (lDist >= 2526 && lDist <= 2749) { return 'Turn 6'; }
		if (lDist >= 2750 && lDist <= 2910) { return 'Turn 7'; }

		// Chang International Circuit - Full Circuit
	} else if (layoutId === 4253) {
		if (lDist >= 4410 || lDist <= 50) { return 'Start-Finish'; }
		if (lDist >= 195 && lDist <= 330) { return 'Turn 1'; }
		if (lDist >= 740 && lDist <= 970) { return 'Turn 2'; }
		if (lDist >= 1180 && lDist <= 1460) { return 'Turn 3'; }
		if (lDist >= 2100 && lDist <= 2305) { return 'Turn 4'; }
		if (lDist >= 2415 && lDist <= 2565) { return 'Turn 5'; }
		if (lDist >= 2566 && lDist <= 2770) { return 'Turn 6'; }
		if (lDist >= 2795 && lDist <= 2970) { return 'Turn 7'; }
		if (lDist >= 3130 && lDist <= 3290) { return 'Turn 8'; }
		if (lDist >= 3350 && lDist <= 3520) { return 'Turn 9'; }
		if (lDist >= 3521 && lDist <= 3720) { return 'Turn 10'; }
		if (lDist >= 3721 && lDist <= 3845) { return 'Turn 11'; }
		if (lDist >= 4180 && lDist <= 4350) { return 'Turn 12'; }

		// Circuit Zandvoort GP
	} else if (layoutId === 1678) {
		if (lDist >= 3955 || lDist <= 310) { return 'Start-Finish'; }
		if (lDist >= 311 && lDist <= 520) { return 'Tarzanbocht'; }
		if (lDist >= 570 && lDist <= 780) { return 'Gerlachbocht'; }
		if (lDist >= 810 && lDist <= 990) { return 'Hugenholtzbocht'; }
		if (lDist >= 1030 && lDist <= 1210) { return 'Hunserug'; }
		if (lDist >= 1250 && lDist <= 1580) { return 'Rob Slotemakerbocht'; }
		if (lDist >= 1635 && lDist <= 1895) { return 'Scheivlak'; }
		if (lDist >= 2030 && lDist <= 2190) { return 'Marlborobocht'; }
		if (lDist >= 2260 && lDist <= 2410) { return 'Renaultbocht'; }
		if (lDist >= 2480 && lDist <= 2680) { return 'Vodafonebocht'; }
		if (lDist >= 3100 && lDist <= 3330) { return 'Audi S'; }
		if (lDist >= 3500 && lDist <= 3650) { return 'Kumhobocht'; }
		if (lDist >= 3690 && lDist <= 3954) { return 'Arie Luyendijkbocht'; }

		// Circuit Zandvoort National
	} else if (layoutId === 1680) {
		if (lDist >= 2565 || lDist <= 310) { return 'Start-Finish'; }
		if (lDist >= 311 && lDist <= 520) { return 'Tarzanbocht'; }
		if (lDist >= 570 && lDist <= 780) { return 'Gerlachbocht'; }
		if (lDist >= 810 && lDist <= 990) { return 'Hugenholtzbocht'; }
		if (lDist >= 1030 && lDist <= 1210) { return 'Hunserug'; }
		if (lDist >= 1250 && lDist <= 1470) { return 'Rob Slotemakerbocht'; }
		if (lDist >= 1710 && lDist <= 1940) { return 'Audi S'; }
		if (lDist >= 2110 && lDist <= 2260) { return 'Kumhobocht'; }
		if (lDist >= 2300 && lDist <= 2564) { return 'Arie Luyendijkbocht'; }

		// Circuit Zandvoort Club
	} else if (layoutId === 1679) {
		if (lDist >= 2285 || lDist <= 310) { return 'Start-Finish'; }
		if (lDist >= 311 && lDist <= 520) { return 'Tarzanbocht'; }
		if (lDist >= 570 && lDist <= 780) { return 'Gerlachbocht'; }
		if (lDist >= 810 && lDist <= 990) { return 'Hugenholtzbocht'; }
		if (lDist >= 1030 && lDist <= 1280) { return 'Hunserug'; }
		if (lDist >= 1331 && lDist <= 1560) { return 'Audi S'; }
		if (lDist >= 1730 && lDist <= 1880) { return 'Kumhobocht'; }
		if (lDist >= 2020 && lDist <= 2284) { return 'Arie Luyendijkbocht'; }

		// Circuit Zolder
	} else if (layoutId === 1684) {
		if (lDist >= 3711 || lDist <= 220) { return 'Start-Finish'; }
		if (lDist >= 221 && lDist <= 415) { return 'Earste Links'; }
		if (lDist >= 528 && lDist <= 705) { return 'Sterrenwachtbocht'; }
		if (lDist >= 731 && lDist <= 930) { return 'Kanaalbocht'; }
		if (lDist >= 1050 && lDist <= 1230) { return 'Lucien Bianchibocht'; }
		if (lDist >= 1700 && lDist <= 1850) { return 'Kleine Chicane'; }
		if (lDist >= 2010 && lDist <= 2215) { return 'Butte'; }
		if (lDist >= 2251 && lDist <= 2465) { return 'Gille Villeneuve Chicane'; }
		if (lDist >= 2501 && lDist <= 2650) { return 'Terlamenbocht'; }
		if (lDist >= 2960 && lDist <= 3065) { return 'Bolderberghaarspeldbocht'; }
		if (lDist >= 3100 && lDist <= 3205) { return 'Jochen Rindtbocht'; }
		if (lDist >= 3575 && lDist <= 3710) { return 'Jackie Ickxbocht'; }

		// Daytona Road Course
	} else if (layoutId === 8367) {
		if (lDist >= 5477 || lDist <= 350) { return 'Start-Finish'; }
		if (lDist >= 420 && lDist <= 593) { return 'Turn 1'; }
		if (lDist >= 640 && lDist <= 735) { return 'Turn 2'; }
		if (lDist >= 885 && lDist <= 1103) { return 'International Horseshoe'; }
		if (lDist >= 1379 && lDist <= 1568) { return 'Dogleg'; }
		if (lDist >= 1660 && lDist <= 1896) { return 'West Horseshoe'; }
		if (lDist >= 2089 && lDist <= 2238) { return 'Turn 6'; }
		if (lDist >= 2384 && lDist <= 2848) { return 'Turn 7'; }
		if (lDist >= 2849 && lDist <= 3313) { return 'Turn 8'; }
		if (lDist >= 3759 && lDist <= 4150) { return 'Bus Stop'; }
		if (lDist >= 4223 && lDist <= 4708) { return 'Turn 13'; }
		if (lDist >= 4709 && lDist <= 5194) { return 'Turn 14'; }

		// Daytona Speedway
	} else if (layoutId === 8648) {
		if (lDist >= 3747 || lDist <= 350) { return 'Start-Finish'; }
		if (lDist >= 625 && lDist <= 1121) { return 'Turn 1'; }
		if (lDist >= 1122 && lDist <= 1618) { return 'Turn 2'; }
		if (lDist >= 2426 && lDist <= 2952) { return 'Turn 3'; }
		if (lDist >= 2953 && lDist <= 3479) { return 'Turn 4'; }

		// Daytona Road Course Motorcycle
	} else if (layoutId === 8655) {
		if (lDist >= 4484 || lDist <= 350) { return 'Start-Finish'; }
		if (lDist >= 420 && lDist <= 593) { return 'Turn 1'; }
		if (lDist >= 640 && lDist <= 735) { return 'Turn 2'; }
		if (lDist >= 885 && lDist <= 1103) { return 'International Horseshoe'; }
		if (lDist >= 1379 && lDist <= 1495) { return 'Turn 4'; }
		if (lDist >= 1496 && lDist <= 1639) { return 'Turn 5'; }
		if (lDist >= 1719 && lDist <= 1931) { return 'Turn 6'; }
		if (lDist >= 1932 && lDist <= 2121) { return 'Turn 7'; }
		if (lDist >= 2122 && lDist <= 2277) { return 'Turn 8'; }
		if (lDist >= 2278 && lDist <= 2488) { return 'Turn 9'; }
		if (lDist >= 2766 && lDist <= 3157) { return 'Bus Stop'; }
		if (lDist >= 3230 && lDist <= 3715) { return 'Turn 14'; }
		if (lDist >= 3716 && lDist <= 4201) { return 'Turn 15'; }

		// DEKRA Lausitzring DTM
	} else if (layoutId === 2468) {
		if (lDist >= 3156 || lDist <= 299) { return 'Start-Finish'; }
		if (lDist >= 360 && lDist <= 450) { return 'DEKRA Kurve'; }
		if (lDist >= 470 && lDist <= 539) { return 'Turn 2'; }
		if (lDist >= 540 && lDist <= 675) { return 'GOODYEAR Kurve'; }
		if (lDist >= 715 && lDist <= 817) { return 'Turn 4'; }
		if (lDist >= 818 && lDist <= 970) { return 'Turn 5'; }
		if (lDist >= 1134 && lDist <= 1346) { return 'ADAC Kurve'; }
		if (lDist >= 1410 && lDist <= 1710) { return 'APCOA Kehre'; }
		if (lDist >= 2160 && lDist <= 2295) { return 'Turn 8'; }
		if (lDist >= 2387 && lDist <= 2489) { return 'Turn 9'; }
		if (lDist >= 2587 && lDist <= 2692) { return 'Turn 10'; }
		if (lDist >= 2693 && lDist <= 2815) { return 'Turn 11'; }
		if (lDist >= 2850 && lDist <= 3155) { return 'CocaCola Turn'; }

		// DEKRA Lausitzring Short
	} else if (layoutId === 3291) {
		if (lDist >= 3126 || lDist <= 299) { return 'Start-Finish'; }
		if (lDist >= 330 && lDist <= 420) { return 'DEKRA Kurve'; }
		if (lDist >= 440 && lDist <= 509) { return 'Turn 2'; }
		if (lDist >= 510 && lDist <= 645) { return 'GOODYEAR Kurve'; }
		if (lDist >= 685 && lDist <= 787) { return 'Turn 4'; }
		if (lDist >= 788 && lDist <= 940) { return 'Turn 5'; }
		if (lDist >= 1104 && lDist <= 1316) { return 'ADAC Kurve'; }
		if (lDist >= 1380 && lDist <= 1680) { return 'APCOA Kehre'; }
		if (lDist >= 2130 && lDist <= 2265) { return 'Turn 8'; }
		if (lDist >= 2357 && lDist <= 2459) { return 'Turn 9'; }
		if (lDist >= 2557 && lDist <= 2662) { return 'Turn 10'; }
		if (lDist >= 2663 && lDist <= 2785) { return 'Turn 11'; }
		if (lDist >= 2820 && lDist <= 3125) { return 'CocaCola Turn'; }

		// DEKRA Lausitzring Grand Prix
	} else if (layoutId === 6166) {
		if (lDist >= 4266 || lDist <= 299) { return 'Start-Finish'; }
		if (lDist >= 330 && lDist <= 420) { return 'DEKRA Kurve'; }
		if (lDist >= 440 && lDist <= 509) { return 'Turn 2'; }
		if (lDist >= 510 && lDist <= 645) { return 'GOODYEAR Kurve'; }
		if (lDist >= 685 && lDist <= 787) { return 'Turn 4'; }
		if (lDist >= 788 && lDist <= 940) { return 'Turn 5'; }
		if (lDist >= 1510 && lDist <= 1611) { return 'Turn 6'; }
		if (lDist >= 1612 && lDist <= 1702) { return 'Turn 7'; }
		if (lDist >= 1755 && lDist <= 1985) { return 'Turn 8'; }
		if (lDist >= 2485 && lDist <= 2815) { return 'APCOA Kehre'; }
		if (lDist >= 3265 && lDist <= 3400) { return 'Turn 10'; }
		if (lDist >= 3492 && lDist <= 3594) { return 'Turn 11'; }
		if (lDist >= 3692 && lDist <= 3797) { return 'Turn 12'; }
		if (lDist >= 3798 && lDist <= 3920) { return 'Turn 13'; }
		if (lDist >= 3955 && lDist <= 4265) { return 'CocaCola Turn'; }

		// DEKRA Lausitzring DTM Grand Prix Course
	} else if (layoutId === 9055) {
		if (lDist >= 4296 || lDist <= 299) { return 'Start-Finish'; }
		if (lDist >= 360 && lDist <= 450) { return 'DEKRA Kurve'; }
		if (lDist >= 470 && lDist <= 539) { return 'Turn 2'; }
		if (lDist >= 540 && lDist <= 675) { return 'GOODYEAR Kurve'; }
		if (lDist >= 715 && lDist <= 817) { return 'Turn 4'; }
		if (lDist >= 818 && lDist <= 970) { return 'Turn 5'; }
		if (lDist >= 1550 && lDist <= 1641) { return 'Turn 6'; }
		if (lDist >= 1642 && lDist <= 1732) { return 'Turn 7'; }
		if (lDist >= 1785 && lDist <= 2015) { return 'Turn 8'; }
		if (lDist >= 2515 && lDist <= 2845) { return 'APCOA Kehre'; }
		if (lDist >= 3295 && lDist <= 3430) { return 'Turn 10'; }
		if (lDist >= 3522 && lDist <= 3624) { return 'Turn 11'; }
		if (lDist >= 3722 && lDist <= 3827) { return 'Turn 12'; }
		if (lDist >= 3828 && lDist <= 3950) { return 'Turn 13'; }
		if (lDist >= 3985 && lDist <= 4295) { return 'CocaCola Turn'; }

		// Dubai Grand Prix Circuit
	} else if (layoutId === 6587) {
		if (lDist >= 5216 || lDist <= 420) { return 'Start-Finish'; }
		if (lDist >= 690 && lDist <= 820) { return 'Turn 1'; }
		if (lDist >= 865 && lDist <= 925) { return 'Turn 2'; }
		if (lDist >= 1025 && lDist <= 1160) { return 'Turn 3'; }
		if (lDist >= 1190 && lDist <= 1265) { return 'Turn 4'; }
		if (lDist >= 1360 && lDist <= 1435) { return 'Turn 5'; }
		if (lDist >= 1460 && lDist <= 1590) { return 'Turn 6'; }
		if (lDist >= 1655 && lDist <= 1740) { return 'Turn 7'; }
		if (lDist >= 1900 && lDist <= 1995) { return 'Turn 8'; }
		if (lDist >= 2015 && lDist <= 2270) { return 'Turn 9'; }
		if (lDist >= 3130 && lDist <= 3245) { return 'Turn 10'; }
		if (lDist >= 3310 && lDist <= 3410) { return 'Turn 11'; }
		if (lDist >= 3655 && lDist <= 3790) { return 'Turn 12'; }
		if (lDist >= 4165 && lDist <= 4325) { return 'Turn 13'; }
		if (lDist >= 4440 && lDist <= 4650) { return 'Turn 14'; }
		if (lDist >= 4685 && lDist <= 4840) { return 'Turn 15'; }
		if (lDist >= 5030 && lDist <= 5215) { return 'Turn 16'; }

		// Dubai Club Circuit
	} else if (layoutId === 7976) {
		if (lDist >= 2376 || lDist <= 420) { return 'Start-Finish'; }
		if (lDist >= 690 && lDist <= 820) { return 'Turn 1'; }
		if (lDist >= 840 && lDist <= 1015) { return 'Turn 2'; }
		if (lDist >= 1135 && lDist <= 1225) { return 'Turn 3'; }
		if (lDist >= 1260 && lDist <= 1345) { return 'Turn 4'; }
		if (lDist >= 1480 && lDist <= 1553) { return 'Turn 5'; }
		if (lDist >= 1554 && lDist <= 1592) { return 'Turn 6'; }
		if (lDist >= 1593 && lDist <= 1663) { return 'Turn 7'; }
		if (lDist >= 1664 && lDist <= 1810) { return 'Turn 8'; }
		if (lDist >= 1845 && lDist <= 2000) { return 'Turn 9'; }
		if (lDist >= 2190 && lDist <= 2375) { return 'Turn 10'; }

		// Dubai National Circuit
	} else if (layoutId === 7977) {
		if (lDist >= 3426 || lDist <= 420) { return 'Start-Finish'; }
		if (lDist >= 690 && lDist <= 820) { return 'Turn 1'; }
		if (lDist >= 865 && lDist <= 925) { return 'Turn 2'; }
		if (lDist >= 1025 && lDist <= 1160) { return 'Turn 3'; }
		if (lDist >= 1190 && lDist <= 1265) { return 'Turn 4'; }
		if (lDist >= 1360 && lDist <= 1435) { return 'Turn 5'; }
		if (lDist >= 1460 && lDist <= 1590) { return 'Turn 6'; }
		if (lDist >= 1655 && lDist <= 1740) { return 'Turn 7'; }
		if (lDist >= 1900 && lDist <= 1995) { return 'Turn 8'; }
		if (lDist >= 2015 && lDist <= 2270) { return 'Turn 9'; }
		if (lDist >= 2530 && lDist <= 2603) { return 'Turn 10'; }
		if (lDist >= 2604 && lDist <= 2642) { return 'Turn 11'; }
		if (lDist >= 2643 && lDist <= 2713) { return 'Turn 12'; }
		if (lDist >= 2714 && lDist <= 2860) { return 'Turn 13'; }
		if (lDist >= 2895 && lDist <= 3050) { return 'Turn 14'; }
		if (lDist >= 3240 && lDist <= 3425) { return 'Turn 15'; }

		// Dubai International Circuit
	} else if (layoutId === 7978) {
		if (lDist >= 4176 || lDist <= 420) { return 'Start-Finish'; }
		if (lDist >= 690 && lDist <= 820) { return 'Turn 1'; }
		if (lDist >= 840 && lDist <= 1015) { return 'Turn 2'; }
		if (lDist >= 1135 && lDist <= 1225) { return 'Turn 3'; }
		if (lDist >= 1260 && lDist <= 1345) { return 'Turn 4'; }
		if (lDist >= 2090 && lDist <= 2205) { return 'Turn 5'; }
		if (lDist >= 2270 && lDist <= 2370) { return 'Turn 6'; }
		if (lDist >= 2615 && lDist <= 2750) { return 'Turn 7'; }
		if (lDist >= 3125 && lDist <= 3285) { return 'Turn 8'; }
		if (lDist >= 3400 && lDist <= 3610) { return 'Turn 9'; }
		if (lDist >= 3645 && lDist <= 3800) { return 'Turn 10'; }
		if (lDist >= 3990 && lDist <= 4175) { return 'Turn 11'; }

		// Falkenberg Motorbana
	} else if (layoutId === 6140) {
		if (lDist >= 1670 || lDist <= 120) { return 'Start-Finish'; }
		if (lDist >= 210 && lDist <= 410) { return 'Chikanen'; }
		if (lDist >= 440 && lDist <= 600) { return 'Nyhemskurvan'; }
		if (lDist >= 620 && lDist <= 800) { return 'Esset'; }
		if (lDist >= 930 && lDist <= 1190) { return 'Högfartarn'; }
		if (lDist >= 1340 && lDist <= 1540) { return 'Ginstkurvan'; }

		// Gelleråsen - Karlskoga Motorstadion GP
	} else if (layoutId === 5925) {
		if (lDist >= 2215 || lDist <= 90) { return 'Start-Finish'; }
		if (lDist >= 320 && lDist <= 450) { return 'Trösen'; }
		if (lDist >= 490 && lDist <= 795) { return 'Esset'; }
		if (lDist >= 1060 && lDist <= 1300) { return 'Ejes Kurva'; }
		if (lDist >= 1410 && lDist <= 1545) { return 'Harnalen'; }
		if (lDist >= 1770 && lDist <= 2190) { return 'Depa Kurvan'; }

		// Gelleråsen - Karlskoga Motorstadion Short
	} else if (layoutId === 6138) {
		if (lDist >= 1015 || lDist <= 100) { return 'Start-Finish'; }
		if (lDist >= 560 && lDist <= 922) { return 'Depa Kurvan'; }

		// Hockenheim GP
	} else if (layoutId === 1693) {
		if (lDist >= 4400 || lDist <= 215) { return 'Start-Finish'; }
		if (lDist >= 216 && lDist <= 405) { return 'Nord Kurve'; }
		if (lDist >= 755 && lDist <= 1020) { return 'Einfahrt Parabolica'; }
		if (lDist >= 1021 && lDist <= 1870) { return 'Parabolica'; }
		if (lDist >= 2025 && lDist <= 2180) { return 'Spitzkehre'; }
		if (lDist >= 2750 && lDist <= 2900) { return 'Mercedes Kurve'; }
		if (lDist >= 3360 && lDist <= 3600) { return 'Mobil 1 Kurve'; }
		if (lDist >= 3700 && lDist <= 3850) { return 'Sachs Kurve'; }
		if (lDist >= 4070 && lDist <= 4399) { return 'Süd Kurve'; }

		// Hockenheim National
	} else if (layoutId === 1763) {
		if (lDist >= 3525 || lDist <= 215) { return 'Start-Finish'; }
		if (lDist >= 216 && lDist <= 405) { return 'Nord Kurve'; }
		if (lDist >= 755 && lDist <= 1020) { return 'Einfahrt Parabolica'; }
		if (lDist >= 1021 && lDist <= 1530) { return 'Parabolica'; }
		if (lDist >= 1880 && lDist <= 2020) { return 'Mercedes Kurve'; }
		if (lDist >= 2490 && lDist <= 2680) { return 'Mobil 1 Kurve'; }
		if (lDist >= 2810 && lDist <= 3025) { return 'Sachs Kurve'; }
		if (lDist >= 3200 && lDist <= 3524) { return 'Süd Kurve'; }

		// Hockenheim Short
	} else if (layoutId === 1764) {
		if (lDist >= 2430 || lDist <= 215) { return 'Start-Finish'; }
		if (lDist >= 216 && lDist <= 405) { return 'Nord Kurve'; }
		if (lDist >= 520 && lDist <= 700) { return 'Ameisen Kurve'; }
		if (lDist >= 701 && lDist <= 1180) { return 'Querspange'; }
		if (lDist >= 1181 && lDist <= 1405) { return 'Ausfahrt Querspange'; }
		if (lDist >= 1406 && lDist <= 1600) { return 'Mobil 1 Kurve'; }
		if (lDist >= 1730 && lDist <= 1925) { return 'Sachs Kurve'; }
		if (lDist >= 2110 && lDist <= 2429) { return 'Süd Kurve'; }

		// Hungaroring GP
	} else if (layoutId === 1866) {
		if (lDist >= 4240 || lDist <= 400) { return 'Start-Finish'; }
		if (lDist >= 550 && lDist <= 665) { return 'Turn 1'; }
		if (lDist >= 700 && lDist <= 875) { return 'Turn 2'; }
		if (lDist >= 1015 && lDist <= 1215) { return 'Turn 3'; }
		if (lDist >= 1260 && lDist <= 1375) { return 'Turn 4'; }
		if (lDist >= 1630 && lDist <= 1745) { return 'Turn 5'; }
		if (lDist >= 1746 && lDist <= 1870) { return 'Turn 6'; }
		if (lDist >= 1950 && lDist <= 2225) { return 'Turn 7'; }
		if (lDist >= 2315 && lDist <= 2373) { return 'Turn 8'; }
		if (lDist >= 2374 && lDist <= 2440) { return 'Turn 9'; }
		if (lDist >= 2525 && lDist <= 2620) { return 'Turn 10'; }
		if (lDist >= 2650 && lDist <= 2780) { return 'Turn 11'; }
		if (lDist >= 2860 && lDist <= 2970) { return 'Turn 12'; }
		if (lDist >= 3030 && lDist <= 3180) { return 'Turn 13'; }
		if (lDist >= 3450 && lDist <= 3580) { return 'Turn 14'; }
		if (lDist >= 3685 && lDist <= 3870) { return 'Turn 15'; }
		if (lDist >= 3950 && lDist <= 4185) { return 'Turn 16'; }

		// Imola
	} else if (layoutId === 1850) {
		if (lDist >= 4510 || lDist <= 290) { return 'Start-Finish'; }
		if (lDist >= 615 && lDist <= 1000) { return 'Variante Tamburello'; }
		if (lDist >= 1235 && lDist <= 1520) { return 'Variante Villeneuve'; }
		if (lDist >= 1630 && lDist <= 1810) { return 'Tosa'; }
		if (lDist >= 2230 && lDist <= 2435) { return 'Piratella'; }
		if (lDist >= 2660 && lDist <= 3000) { return 'Acque Minerali'; }
		if (lDist >= 3300 && lDist <= 3490) { return 'Variante Alta'; }
		if (lDist >= 4050 && lDist <= 4390) { return 'Rivazza'; }

		// Indianapolis GP
	} else if (layoutId === 1852) {
		if (lDist >= 3845 || lDist <= 395) { return 'Start-Finish'; }
		if (lDist >= 585 && lDist <= 695) { return 'Turn 1'; }
		if (lDist >= 696 && lDist <= 805) { return 'Turn 2'; }
		if (lDist >= 806 && lDist <= 985) { return 'Turn 3'; }
		if (lDist >= 1000 && lDist <= 1155) { return 'Turn 4'; }
		if (lDist >= 1215 && lDist <= 1330) { return 'Turn 5'; }
		if (lDist >= 1415 && lDist <= 1625) { return 'Turn 6'; }
		if (lDist >= 1640 && lDist <= 1790) { return 'Turn 7'; }
		if (lDist >= 2240 && lDist <= 2400) { return 'Turn 8'; }
		if (lDist >= 2410 && lDist <= 2510) { return 'Turn 9'; }
		if (lDist >= 2511 && lDist <= 2580) { return 'Turn 10'; }
		if (lDist >= 2640 && lDist <= 2790) { return 'Turn 11'; }
		if (lDist >= 2880 && lDist <= 3185) { return 'Turn 12'; }
		if (lDist >= 3345 && lDist <= 3820) { return 'Turn 13'; }

		// Indianapolis Moto
	} else if (layoutId === 2014) {
		if (lDist >= 3785 || lDist <= 195) { return 'Start-Finish'; }
		if (lDist >= 245 && lDist <= 580) { return 'Turn 1'; }
		if (lDist >= 620 && lDist <= 700) { return 'Turn 2'; }
		if (lDist >= 725 && lDist <= 781) { return 'Turn 3'; }
		if (lDist >= 782 && lDist <= 900) { return 'Turn 4'; }
		if (lDist >= 1030 && lDist <= 1310) { return 'Turn 5'; }
		if (lDist >= 1385 && lDist <= 1570) { return 'Turn 6'; }
		if (lDist >= 1630 && lDist <= 1690) { return 'Turn 7'; }
		if (lDist >= 1691 && lDist <= 1790) { return 'Turn 8'; }
		if (lDist >= 1820 && lDist <= 1960) { return 'Turn 9'; }
		if (lDist >= 2410 && lDist <= 2555) { return 'Turn 10'; }
		if (lDist >= 2580 && lDist <= 2800) { return 'Turn 11'; }
		if (lDist >= 2890 && lDist <= 3000) { return 'Turn 12'; }
		if (lDist >= 3050 && lDist <= 3200) { return 'Turn 13'; }
		if (lDist >= 3230 && lDist <= 3380) { return 'Turn 14'; }
		if (lDist >= 3410 && lDist <= 3504) { return 'Turn 15'; }
		if (lDist >= 3505 && lDist <= 3605) { return 'Turn 16'; }

		// Knutstorp Ring GP
	} else if (layoutId === 6137) {
		if (lDist >= 1966 || lDist <= 175) { return 'Start-Finish'; }
		if (lDist >= 280 && lDist <= 395) { return 'Startkurvan'; }
		if (lDist >= 420 && lDist <= 525) { return 'Tunnelen'; }
		if (lDist >= 550 && lDist <= 640) { return 'Svacken'; }
		if (lDist >= 660 && lDist <= 780) { return 'Tändstiften'; }
		if (lDist >= 800 && lDist <= 890) { return 'Kompressionen'; }
		if (lDist >= 950 && lDist <= 1060) { return 'Venestre for Harnalen'; }
		if (lDist >= 1100 && lDist <= 1200) { return 'Harnalen'; }
		if (lDist >= 1240 && lDist <= 1330) { return 'Venestre efter Harnalen'; }
		if (lDist >= 1375 && lDist <= 1455) { return 'Kvällposten'; }
		if (lDist >= 1535 && lDist <= 1641) { return 'Gryden'; }
		if (lDist >= 1675 && lDist <= 1755) { return 'Bäcken'; }
		if (lDist >= 1775 && lDist <= 1885) { return 'Oplobskurven'; }

		// Macau
	} else if (layoutId === 2123) {
		if (lDist >= 5921 || lDist <= 170) { return 'Start-Finish'; }
		if (lDist >= 171 && lDist <= 355) { return 'Reservoir'; }
		if (lDist >= 970 && lDist <= 1185) { return 'Hotel Mandarin Oriental'; }
		if (lDist >= 1810 && lDist <= 1920) { return 'Hotel Lisboa'; }
		if (lDist >= 2085 && lDist <= 2450) { return 'St. Francisco Hill'; }
		if (lDist >= 2680 && lDist <= 2770) { return 'Maternity'; }
		if (lDist >= 2890 && lDist <= 3050) { return 'Teddy Yip'; }
		if (lDist >= 3085 && lDist <= 2430) { return 'Solitude Esses'; }
		if (lDist >= 3475 && lDist <= 3590) { return 'Paiol'; }
		if (lDist >= 3850 && lDist <= 3940) { return 'Police'; }
		if (lDist >= 4015 && lDist <= 4080) { return 'Moorish'; }
		if (lDist >= 4150 && lDist <= 4260) { return 'Dona Maria'; }
		if (lDist >= 4261 && lDist <= 4420) { return 'Dona Maria II'; }
		if (lDist >= 4555 && lDist <= 4660) { return 'Melco'; }
		if (lDist >= 4790 && lDist <= 5080) { return 'Black Sands'; }
		if (lDist >= 5190 && lDist <= 5380) { return 'Fisherman´s'; }
		if (lDist >= 5750 && lDist <= 5920) { return 'R'; }

		// Mantorp Park Long
	} else if (layoutId === 6010) {
		if (lDist >= 2930 || lDist <= 80) { return 'Start-Finish'; }
		if (lDist >= 175 && lDist <= 400) { return 'Startkurvan'; }
		if (lDist >= 465 && lDist <= 680) { return 'Paris'; }
		if (lDist >= 910 && lDist <= 1030) { return 'Chikanan'; }
		if (lDist >= 1170 && lDist <= 1770) { return 'Strippen'; }
		if (lDist >= 1900 && lDist <= 2200) { return 'Mjölbykurvan'; }
		if (lDist >= 2340 && lDist <= 2490) { return 'Krönet'; }
		if (lDist >= 2545 && lDist <= 2715) { return 'Harnalen'; }
		if (lDist >= 2835 && lDist <= 2920) { return 'Depakurvan'; }

		// Mantorp Park Short
	} else if (layoutId === 6167) {
		if (lDist >= 1690 || lDist <= 80) { return 'Start-Finish'; }
		if (lDist >= 175 && lDist <= 400) { return 'Startkurvan'; }
		if (lDist >= 465 && lDist <= 680) { return 'Paris'; }
		if (lDist >= 910 && lDist <= 1030) { return 'Chikanan'; }
		if (lDist >= 1170 && lDist <= 1400) { return 'Strippen'; }
		if (lDist >= 1530 && lDist <= 1665) { return 'Mjölbykurvan'; }

		// Mid Ohio Full
	} else if (layoutId === 1674) {
		if (lDist >= 3731 || lDist <= 210) { return 'Start-Finish'; }
		if (lDist >= 230 && lDist <= 450) { return 'Turn 1'; }
		if (lDist >= 915 && lDist <= 1150) { return 'Keyhole'; }
		if (lDist >= 1500 && lDist <= 1720) { return 'Kink'; }
		if (lDist >= 2015 && lDist <= 2160) { return 'Turn 4'; }
		if (lDist >= 2180 && lDist <= 2340) { return 'Madness'; }
		if (lDist >= 2380 && lDist <= 2490) { return 'Turn 6'; }
		if (lDist >= 2510 && lDist <= 2730) { return 'The Esses'; }
		if (lDist >= 2770 && lDist <= 2895) { return 'Turn 8'; }
		if (lDist >= 2896 && lDist <= 3055) { return 'Thundervalley'; }
		if (lDist >= 3056 && lDist <= 3205) { return 'Turn 9'; }
		if (lDist >= 3230 && lDist <= 3370) { return 'Turn 10'; }
		if (lDist >= 3455 && lDist <= 3620) { return 'The Carousel'; }
		if (lDist >= 3640 && lDist <= 3730) { return 'Turn 12'; }

		// Mid Ohio Short
	} else if (layoutId === 1675) {
		if (lDist >= 2786 || lDist <= 195) { return 'Start-Finish'; }
		if (lDist >= 245 && lDist <= 580) { return 'Turn 1'; }
		if (lDist >= 480 && lDist <= 675) { return 'Turn 2'; }
		if (lDist >= 1090 && lDist <= 1215) { return 'Turn 3'; }
		if (lDist >= 1235 && lDist <= 1395) { return 'Madness'; }
		if (lDist >= 1435 && lDist <= 1545) { return 'Turn 5'; }
		if (lDist >= 1565 && lDist <= 2785) { return 'The Esses'; }
		if (lDist >= 2825 && lDist <= 1950) { return 'Turn 7'; }
		if (lDist >= 1951 && lDist <= 2110) { return 'Thundervalley'; }
		if (lDist >= 2111 && lDist <= 2260) { return 'Turn 9'; }
		if (lDist >= 2285 && lDist <= 2425) { return 'Turn 10'; }
		if (lDist >= 2510 && lDist <= 2675) { return 'The Carousel'; }
		if (lDist >= 2695 && lDist <= 2785) { return 'Turn 12'; }

		// Mid Ohio Chicane
	} else if (layoutId === 1676) {
		if (lDist >= 3726 || lDist <= 210) { return 'Start-Finish'; }
		if (lDist >= 230 && lDist <= 450) { return 'Turn 1'; }
		if (lDist >= 660 && lDist <= 750) { return 'Turn 2'; }
		if (lDist >= 751 && lDist <= 910) { return 'Chicane'; }
		if (lDist >= 915 && lDist <= 1150) { return 'Keyhole'; }
		if (lDist >= 1500 && lDist <= 1720) { return 'Kink'; }
		if (lDist >= 2035 && lDist <= 2170) { return 'Turn 7'; }
		if (lDist >= 2190 && lDist <= 2340) { return 'Madness'; }
		if (lDist >= 2385 && lDist <= 2500) { return 'Turn 9'; }
		if (lDist >= 2505 && lDist <= 2740) { return 'The Esses'; }
		if (lDist >= 2775 && lDist <= 2870) { return 'Turn 11'; }
		if (lDist >= 2871 && lDist <= 3030) { return 'Thundervalley'; }
		if (lDist >= 3031 && lDist <= 3200) { return 'Turn 12'; }
		if (lDist >= 3220 && lDist <= 3360) { return 'Turn 13'; }
		if (lDist >= 3450 && lDist <= 3615) { return 'The Carousel'; }
		if (lDist >= 3620 && lDist <= 3725) { return 'Turn 15'; }

		// Monza GP
	} else if (layoutId === 1671) {
		if (lDist >= 5375 || lDist <= 310) { return 'Start-Finish'; }
		if (lDist >= 570 && lDist <= 720) { return 'Rettifilo'; }
		if (lDist >= 950 && lDist <= 1510) { return 'Grande'; }
		if (lDist >= 1775 && lDist <= 1970) { return 'Roggia'; }
		if (lDist >= 2160 && lDist <= 2370) { return 'Lesmo 1'; }
		if (lDist >= 2520 && lDist <= 2660) { return 'Lesmo 2'; }
		if (lDist >= 2870 && lDist <= 3150) { return 'Serraglio'; }
		if (lDist >= 3570 && lDist <= 3920) { return 'Ascari'; }
		if (lDist >= 4775 && lDist <= 5270) { return 'Parabolica'; }

		// Monza Junior
	} else if (layoutId === 1672) {
		if (lDist >= 2015 || lDist <= 120) { return 'Start-Finish'; }
		if (lDist >= 190 && lDist <= 390) { return 'Turn 1'; }
		if (lDist >= 391 && lDist <= 505) { return 'Turn 2'; }
		if (lDist >= 506 && lDist <= 685) { return 'Turn 3'; }
		if (lDist >= 1415 && lDist <= 1910) { return 'Parabolica'; }

		// Moscow Sprint
	} else if (layoutId === 2473) {
		if (lDist >= 2336 || lDist <= 165) { return 'Start-Finish'; }
		if (lDist >= 166 && lDist <= 270) { return 'Turn 1'; }
		if (lDist >= 370 && lDist <= 520) { return 'Turn 2'; }
		if (lDist >= 595 && lDist <= 860) { return 'Turn 3'; }
		if (lDist >= 925 && lDist <= 995) { return 'Turn 4'; }
		if (lDist >= 996 && lDist <= 1060) { return 'Turn 5'; }
		if (lDist >= 1080 && lDist <= 1140) { return 'Turn 6'; }
		if (lDist >= 1170 && lDist <= 1260) { return 'Turn 7'; }
		if (lDist >= 1261 && lDist <= 1370) { return 'Turn 8'; }
		if (lDist >= 1371 && lDist <= 1455) { return 'Turn 9'; }
		if (lDist >= 1456 && lDist <= 1530) { return 'Turn 10'; }
		if (lDist >= 2210 && lDist <= 2335) { return 'Turn 11'; }

		// Moscow GP
	} else if (layoutId === 3383) {
		if (lDist >= 3810 || lDist <= 165) { return 'Start-Finish'; }
		if (lDist >= 166 && lDist <= 270) { return 'Turn 1'; }
		if (lDist >= 370 && lDist <= 520) { return 'Turn 2'; }
		if (lDist >= 595 && lDist <= 860) { return 'Turn 3'; }
		if (lDist >= 925 && lDist <= 995) { return 'Turn 4'; }
		if (lDist >= 996 && lDist <= 1060) { return 'Turn 5'; }
		if (lDist >= 1080 && lDist <= 1140) { return 'Turn 6'; }
		if (lDist >= 1170 && lDist <= 1260) { return 'Turn 7'; }
		if (lDist >= 1261 && lDist <= 1370) { return 'Turn 8'; }
		if (lDist >= 1555 && lDist <= 1640) { return 'Turn 9'; }
		if (lDist >= 1641 && lDist <= 1710) { return 'Turn 10'; }
		if (lDist >= 1711 && lDist <= 1815) { return 'Turn 11'; }
		if (lDist >= 1890 && lDist <= 1970) { return 'Turn 12'; }
		if (lDist >= 2010 && lDist <= 2125) { return 'Turn 13'; }
		if (lDist >= 2180 && lDist <= 2285) { return 'Turn 14'; }
		if (lDist >= 2400 && lDist <= 2540) { return 'Turn 15'; }
		if (lDist >= 2541 && lDist <= 2690) { return 'Turn 16'; }
		if (lDist >= 3630 && lDist <= 3740) { return 'Turn 17'; }

		// Moscow FIM
	} else if (layoutId === 3683) {
		if (lDist >= 3716 || lDist <= 165) { return 'Start-Finish'; }
		if (lDist >= 166 && lDist <= 270) { return 'Turn 1'; }
		if (lDist >= 370 && lDist <= 520) { return 'Turn 2'; }
		if (lDist >= 595 && lDist <= 860) { return 'Turn 3'; }
		if (lDist >= 925 && lDist <= 995) { return 'Turn 4'; }
		if (lDist >= 996 && lDist <= 1060) { return 'Turn 5'; }
		if (lDist >= 1080 && lDist <= 1140) { return 'Turn 6'; }
		if (lDist >= 1170 && lDist <= 1260) { return 'Turn 7'; }
		if (lDist >= 1261 && lDist <= 1370) { return 'Turn 8'; }
		if (lDist >= 1700 && lDist <= 1790) { return 'Turn 9'; }
		if (lDist >= 1865 && lDist <= 1945) { return 'Turn 10'; }
		if (lDist >= 1985 && lDist <= 2100) { return 'Turn 11'; }
		if (lDist >= 2155 && lDist <= 2260) { return 'Turn 12'; }
		if (lDist >= 2375 && lDist <= 2515) { return 'Turn 13'; }
		if (lDist >= 2516 && lDist <= 2665) { return 'Turn 14'; }
		if (lDist >= 3605 && lDist <= 3715) { return 'Turn 15'; }

		// Motorland Aragaon Grand Prix
	} else if (layoutId === 8704) {
		if (lDist >= 5001 || lDist <= 214) { return 'Start-Finish'; }
		if (lDist >= 215 && lDist <= 308) { return 'Turn 1'; }
		if (lDist >= 373 && lDist <= 535) { return 'Turn 2'; }
		if (lDist >= 636 && lDist <= 775) { return 'Turn 3'; }
		if (lDist >= 930 && lDist <= 1055) { return 'Turn 4'; }
		if (lDist >= 1095 && lDist <= 1210) { return 'Turn 5'; }
		if (lDist >= 1280 && lDist <= 1400) { return 'Turn 6'; }
		if (lDist >= 1505 && lDist <= 1630) { return 'Turn 7'; }
		if (lDist >= 1874 && lDist <= 1960) { return 'Turn 8'; }
		if (lDist >= 1961 && lDist <= 2055) { return 'Turn 9'; }
		if (lDist >= 2120 && lDist <= 2385) { return 'Turn 10'; }
		if (lDist >= 2485 && lDist <= 2785) { return 'Turn 11'; }
		if (lDist >= 2850 && lDist <= 2950) { return 'Turn 12'; }
		if (lDist >= 3000 && lDist <= 3150) { return 'Turn 13'; }
		if (lDist >= 3265 && lDist <= 3335) { return 'Turn 14'; }
		if (lDist >= 3365 && lDist <= 3450) { return 'Turn 15'; }
		if (lDist >= 4600 && lDist <= 4685) { return 'Turn 16'; }
		if (lDist >= 4720 && lDist <= 4795) { return 'Turn 17'; }
		if (lDist >= 4885 && lDist <= 5000) { return 'Turn 18'; }

		// Motorland Aragaon Motorcycle Grand Prix
	} else if (layoutId === 9040) {
		if (lDist >= 4751 || lDist <= 214) { return 'Start-Finish'; }
		if (lDist >= 215 && lDist <= 308) { return 'Turn 1'; }
		if (lDist >= 373 && lDist <= 535) { return 'Turn 2'; }
		if (lDist >= 636 && lDist <= 775) { return 'Turn 3'; }
		if (lDist >= 930 && lDist <= 1055) { return 'Turn 4'; }
		if (lDist >= 1095 && lDist <= 1210) { return 'Turn 5'; }
		if (lDist >= 1280 && lDist <= 1400) { return 'Turn 6'; }
		if (lDist >= 1505 && lDist <= 1630) { return 'Turn 7'; }
		if (lDist >= 1874 && lDist <= 1960) { return 'Turn 8'; }
		if (lDist >= 1961 && lDist <= 2055) { return 'Turn 9'; }
		if (lDist >= 2120 && lDist <= 2385) { return 'Turn 10'; }
		if (lDist >= 2485 && lDist <= 2785) { return 'Turn 11'; }
		if (lDist >= 2850 && lDist <= 2950) { return 'Turn 12'; }
		if (lDist >= 3000 && lDist <= 3150) { return 'Turn 13'; }
		if (lDist >= 3265 && lDist <= 3335) { return 'Turn 14'; }
		if (lDist >= 3365 && lDist <= 3450) { return 'Turn 15'; }
		if (lDist >= 4355 && lDist <= 4750) { return 'Turn 16'; }

		// Motorland Aragaon National
	} else if (layoutId === 9041) {
		if (lDist >= 2301 || lDist <= 214) { return 'Start-Finish'; }
		if (lDist >= 215 && lDist <= 308) { return 'Turn 1'; }
		if (lDist >= 373 && lDist <= 535) { return 'Turn 2'; }
		if (lDist >= 590 && lDist <= 680) { return 'Turn 3'; }
		if (lDist >= 710 && lDist <= 815) { return 'Turn 4'; }
		if (lDist >= 875 && lDist <= 865) { return 'Turn 5'; }
		if (lDist >= 866 && lDist <= 1070) { return 'Turn 6'; }
		if (lDist >= 1165 && lDist <= 1215) { return 'Turn 7'; }
		if (lDist >= 1216 && lDist <= 1280) { return 'Turn 8'; }
		if (lDist >= 1345 && lDist <= 1410) { return 'Turn 9'; }
		if (lDist >= 1455 && lDist <= 1545) { return 'Turn 10'; }
		if (lDist >= 1900 && lDist <= 1985) { return 'Turn 11'; }
		if (lDist >= 2020 && lDist <= 2095) { return 'Turn 12'; }
		if (lDist >= 2185 && lDist <= 2300) { return 'Turn 13'; }

		// Motorland Aragaon Motorcycle International
	} else if (layoutId === 9042) {
		if (lDist >= 2051 || lDist <= 214) { return 'Start-Finish'; }
		if (lDist >= 215 && lDist <= 308) { return 'Turn 1'; }
		if (lDist >= 373 && lDist <= 535) { return 'Turn 2'; }
		if (lDist >= 590 && lDist <= 680) { return 'Turn 3'; }
		if (lDist >= 710 && lDist <= 815) { return 'Turn 4'; }
		if (lDist >= 875 && lDist <= 865) { return 'Turn 5'; }
		if (lDist >= 866 && lDist <= 1070) { return 'Turn 6'; }
		if (lDist >= 1165 && lDist <= 1215) { return 'Turn 7'; }
		if (lDist >= 1216 && lDist <= 1280) { return 'Turn 8'; }
		if (lDist >= 1345 && lDist <= 1410) { return 'Turn 9'; }
		if (lDist >= 1455 && lDist <= 1545) { return 'Turn 10'; }
		if (lDist >= 1655 && lDist <= 2050) { return 'Turn 11'; }

		// Motorland Aragaon Fast Circuit
	} else if (layoutId === 9043) {
		if (lDist >= 4616 || lDist <= 214) { return 'Start-Finish'; }
		if (lDist >= 215 && lDist <= 308) { return 'Turn 1'; }
		if (lDist >= 373 && lDist <= 535) { return 'Turn 2'; }
		if (lDist >= 636 && lDist <= 775) { return 'Turn 3'; }
		if (lDist >= 930 && lDist <= 1055) { return 'Turn 4'; }
		if (lDist >= 1095 && lDist <= 1210) { return 'Turn 5'; }
		if (lDist >= 1280 && lDist <= 1400) { return 'Turn 6'; }
		if (lDist >= 1505 && lDist <= 1630) { return 'Turn 7'; }
		if (lDist >= 1874 && lDist <= 1960) { return 'Turn 8'; }
		if (lDist >= 1961 && lDist <= 2055) { return 'Turn 9'; }
		if (lDist >= 2120 && lDist <= 2385) { return 'Turn 10'; }
		if (lDist >= 2485 && lDist <= 3170) { return 'Turn 11'; }
		if (lDist >= 4220 && lDist <= 4615) { return 'Turn 12'; }

		// Motorsport Arena Oschersleben A Course
	} else if (layoutId === 2384) {
		if (lDist >= 3500 || lDist <= 360) { return 'Start-Finish'; }
		if (lDist >= 445 && lDist <= 510) { return 'Turn 1'; }
		if (lDist >= 511 && lDist <= 740) { return 'Hotel'; }
		if (lDist >= 965 && lDist <= 1160) { return 'Hasseröder'; }
		if (lDist >= 1400 && lDist <= 1690) { return 'Tripel'; }
		if (lDist >= 1691 && lDist <= 1910) { return 'Turn 7'; }
		if (lDist >= 2000 && lDist <= 2110) { return 'Schikane'; }
		if (lDist >= 2111 && lDist <= 2270) { return 'MC Donald´s'; }
		if (lDist >= 2740 && lDist <= 2950) { return 'Shell-S'; }
		if (lDist >= 3100 && lDist <= 3210) { return 'Bauer'; }
		if (lDist >= 3285 && lDist <= 3445) { return 'Zeppelin'; }

		// Motorsport Arena Oschersleben B Course
	} else if (layoutId === 7753) {
		if (lDist >= 2230 || lDist <= 360) { return 'Start-Finish'; }
		if (lDist >= 445 && lDist <= 510) { return 'Turn 1'; }
		if (lDist >= 511 && lDist <= 740) { return 'Hotel'; }
		if (lDist >= 965 && lDist <= 1160) { return 'Hasseröder'; }
		if (lDist >= 1195 && lDist <= 1320) { return 'Turn 4'; }
		if (lDist >= 1470 && lDist <= 1675) { return 'Shell-S'; }
		if (lDist >= 1835 && lDist <= 1950) { return 'Bauer'; }
		if (lDist >= 2010 && lDist <= 2170) { return 'Zeppelin'; }

		// Motorsport Arena Oschersleben Motorcycle A Course
	} else if (layoutId === 7754) {
		if (lDist >= 3475 || lDist <= 360) { return 'Start-Finish'; }
		if (lDist >= 395 && lDist <= 490) { return 'Turn 1'; }
		if (lDist >= 491 && lDist <= 715) { return 'Hotel'; }
		if (lDist >= 940 && lDist <= 1135) { return 'Hasseröder'; }
		if (lDist >= 1375 && lDist <= 1665) { return 'Tripel'; }
		if (lDist >= 1666 && lDist <= 1885) { return 'Turn 7'; }
		if (lDist >= 1975 && lDist <= 2085) { return 'Schikane'; }
		if (lDist >= 2086 && lDist <= 2245) { return 'MC Donald´s'; }
		if (lDist >= 2715 && lDist <= 2925) { return 'Shell-S'; }
		if (lDist >= 3075 && lDist <= 3185) { return 'Bauer'; }
		if (lDist >= 3260 && lDist <= 3420) { return 'Zeppelin'; }

		// Motorsport Arena Oschersleben Motorcycle B Course
	} else if (layoutId === 7755) {
		if (lDist >= 2205 || lDist <= 360) { return 'Start-Finish'; }
		if (lDist >= 395 && lDist <= 490) { return 'Turn 1'; }
		if (lDist >= 491 && lDist <= 715) { return 'Hotel'; }
		if (lDist >= 940 && lDist <= 1135) { return 'Hasseröder'; }
		if (lDist >= 1170 && lDist <= 1300) { return 'Turn 4'; }
		if (lDist >= 1450 && lDist <= 1660) { return 'Shell-S'; }
		if (lDist >= 1815 && lDist <= 1925) { return 'Bauer'; }
		if (lDist >= 1990 && lDist <= 2150) { return 'Zeppelin'; }

		// Ningbo International Full Circuit
	} else if (layoutId === 7273) {
		if (lDist >= 3761 || lDist <= 149) { return 'Start-Finish'; }
		if (lDist >= 150 && lDist <= 260) { return 'Turn 1'; }
		if (lDist >= 345 && lDist <= 440) { return 'Turn 2'; }
		if (lDist >= 505 && lDist <= 604) { return 'Turn 3'; }
		if (lDist >= 605 && lDist <= 760) { return 'Turn 4'; }
		if (lDist >= 1020 && lDist <= 1084) { return 'Turn 5'; }
		if (lDist >= 1085 && lDist <= 1275) { return 'Turn 6'; }
		if (lDist >= 1310 && lDist <= 1375) { return 'Turn 7'; }
		if (lDist >= 1376 && lDist <= 1470) { return 'Turn 8'; }
		if (lDist >= 1730 && lDist <= 1860) { return 'Turn 9'; }
		if (lDist >= 2235 && lDist <= 2310) { return 'Turn 10'; }
		if (lDist >= 2440 && lDist <= 2494) { return 'Turn 11'; }
		if (lDist >= 2495 && lDist <= 2555) { return 'Turn 12'; }
		if (lDist >= 2655 && lDist <= 2723) { return 'Turn 13'; }
		if (lDist >= 2724 && lDist <= 2810) { return 'Turn 14'; }
		if (lDist >= 2890 && lDist <= 3030) { return 'Turn 15'; }
		if (lDist >= 3130 && lDist <= 3177) { return 'Turn 16'; }
		if (lDist >= 3178 && lDist <= 3255) { return 'Turn 17'; }
		if (lDist >= 3256 && lDist <= 3385) { return 'Turn 18'; }
		if (lDist >= 3480 && lDist <= 3565) { return 'Turn 19'; }
		if (lDist >= 3605 && lDist <= 3670) { return 'Turn 20'; }
		if (lDist >= 3671 && lDist <= 3760) { return 'Turn 21'; }

		// Ningbo International Full Circuit no Chicane
	} else if (layoutId === 8309) {
		if (lDist >= 3722 || lDist <= 149) { return 'Start-Finish'; }
		if (lDist >= 150 && lDist <= 260) { return 'Turn 1'; }
		if (lDist >= 345 && lDist <= 440) { return 'Turn 2'; }
		if (lDist >= 505 && lDist <= 604) { return 'Turn 3'; }
		if (lDist >= 605 && lDist <= 760) { return 'Turn 4'; }
		if (lDist >= 1020 && lDist <= 1084) { return 'Turn 5'; }
		if (lDist >= 1085 && lDist <= 1275) { return 'Turn 6'; }
		if (lDist >= 1310 && lDist <= 1375) { return 'Turn 7'; }
		if (lDist >= 1376 && lDist <= 1470) { return 'Turn 8'; }
		if (lDist >= 1730 && lDist <= 1860) { return 'Turn 9'; }
		if (lDist >= 2235 && lDist <= 2310) { return 'Turn 10'; }
		if (lDist >= 2617 && lDist <= 2685) { return 'Turn 11'; }
		if (lDist >= 2686 && lDist <= 2772) { return 'Turn 12'; }
		if (lDist >= 2852 && lDist <= 2992) { return 'Turn 13'; }
		if (lDist >= 3092 && lDist <= 3139) { return 'Turn 14'; }
		if (lDist >= 3140 && lDist <= 3217) { return 'Turn 15'; }
		if (lDist >= 3218 && lDist <= 3347) { return 'Turn 16'; }
		if (lDist >= 3442 && lDist <= 3527) { return 'Turn 17'; }
		if (lDist >= 3567 && lDist <= 3632) { return 'Turn 18'; }
		if (lDist >= 3633 && lDist <= 3722) { return 'Turn 19'; }

		// Ningbo International Intermediate Circuit
	} else if (layoutId === 8310) {
		if (lDist >= 3304 || lDist <= 149) { return 'Start-Finish'; }
		if (lDist >= 150 && lDist <= 260) { return 'Turn 1'; }
		if (lDist >= 345 && lDist <= 440) { return 'Turn 2'; }
		if (lDist >= 505 && lDist <= 604) { return 'Turn 3'; }
		if (lDist >= 605 && lDist <= 760) { return 'Turn 4'; }
		if (lDist >= 1020 && lDist <= 1084) { return 'Turn 5'; }
		if (lDist >= 1085 && lDist <= 1275) { return 'Turn 6'; }
		if (lDist >= 1310 && lDist <= 1375) { return 'Turn 7'; }
		if (lDist >= 1376 && lDist <= 1470) { return 'Turn 8'; }
		if (lDist >= 1730 && lDist <= 1860) { return 'Turn 9'; }
		if (lDist >= 2235 && lDist <= 2310) { return 'Turn 10'; }
		if (lDist >= 2440 && lDist <= 2494) { return 'Turn 11'; }
		if (lDist >= 2495 && lDist <= 2555) { return 'Turn 12'; }
		if (lDist >= 2645 && lDist <= 2780) { return 'Turn 13'; }
		if (lDist >= 2799 && lDist <= 2928) { return 'Turn 14'; }
		if (lDist >= 3023 && lDist <= 3108) { return 'Turn 15'; }
		if (lDist >= 3148 && lDist <= 3213) { return 'Turn 16'; }
		if (lDist >= 3214 && lDist <= 3303) { return 'Turn 17'; }

		// Ningbo International Intermediate no Chicane
	} else if (layoutId === 8311) {
		if (lDist >= 3266 || lDist <= 149) { return 'Start-Finish'; }
		if (lDist >= 150 && lDist <= 260) { return 'Turn 1'; }
		if (lDist >= 345 && lDist <= 440) { return 'Turn 2'; }
		if (lDist >= 505 && lDist <= 604) { return 'Turn 3'; }
		if (lDist >= 605 && lDist <= 760) { return 'Turn 4'; }
		if (lDist >= 1020 && lDist <= 1084) { return 'Turn 5'; }
		if (lDist >= 1085 && lDist <= 1275) { return 'Turn 6'; }
		if (lDist >= 1310 && lDist <= 1375) { return 'Turn 7'; }
		if (lDist >= 1376 && lDist <= 1470) { return 'Turn 8'; }
		if (lDist >= 1730 && lDist <= 1860) { return 'Turn 9'; }
		if (lDist >= 2235 && lDist <= 2310) { return 'Turn 10'; }
		if (lDist >= 2607 && lDist <= 2742) { return 'Turn 11'; }
		if (lDist >= 2761 && lDist <= 2890) { return 'Turn 12'; }
		if (lDist >= 2985 && lDist <= 3070) { return 'Turn 13'; }
		if (lDist >= 3110 && lDist <= 3175) { return 'Turn 14'; }
		if (lDist >= 3176 && lDist <= 3265) { return 'Turn 15'; }

		// Ningbo International Short Circuit
	} else if (layoutId === 8314) {
		if (lDist >= 1634 || lDist <= 149) { return 'Start-Finish'; }
		if (lDist >= 150 && lDist <= 260) { return 'Turn 1'; }
		if (lDist >= 345 && lDist <= 440) { return 'Turn 2'; }
		if (lDist >= 505 && lDist <= 604) { return 'Turn 3'; }
		if (lDist >= 605 && lDist <= 760) { return 'Turn 4'; }
		if (lDist >= 1020 && lDist <= 1084) { return 'Turn 5'; }
		if (lDist >= 1085 && lDist <= 1150) { return 'Turn 6'; }
		if (lDist >= 1151 && lDist <= 1320) { return 'Turn 7'; }
		if (lDist >= 1370 && lDist <= 1455) { return 'Turn 8'; }
		if (lDist >= 1478 && lDist <= 1543) { return 'Turn 9'; }
		if (lDist >= 1544 && lDist <= 1633) { return 'Turn 10'; }

		//  Nordschleife Nordschleife
	} else if (layoutId === 2813) {
		if (lDist >= 20646 || lDist <= 45) { return 'Start-Finish'; }
		if (lDist >= 46 && lDist <= 175) { return 'T13'; }
		if (lDist >= 405 && lDist <= 535) { return 'Hatzenbachbogen'; }
		if (lDist >= 780 && lDist <= 1510) { return 'Hatzenbach'; }
		if (lDist >= 1520 && lDist <= 1850) { return 'Hocheichen'; }
		if (lDist >= 1851 && lDist <= 2135) { return 'Quiddelbacher Höhe'; }
		if (lDist >= 2136 && lDist <= 2385) { return 'Flugplatz'; }
		if (lDist >= 2386 && lDist <= 3005) { return 'Kottenborn'; }
		if (lDist >= 3330 && lDist <= 3600) { return 'Schwedenkreuz'; }
		if (lDist >= 3690 && lDist <= 3880) { return 'Aremberg'; }
		if (lDist >= 3881 && lDist <= 4715) { return 'Fuchsröhre'; }
		if (lDist >= 4920 && lDist <= 5240) { return 'Adenauer Forst'; }
		if (lDist >= 5685 && lDist <= 6145) { return 'Metzgesfeld'; }
		if (lDist >= 6310 && lDist <= 6475) { return 'Kallenhard'; }
		if (lDist >= 6610 && lDist <= 6780) { return 'Spiegelkurve'; }
		if (lDist >= 6825 && lDist <= 7090) { return '3 fach rechts'; }
		if (lDist >= 7200 && lDist <= 7455) { return 'Wehrseifen'; }
		if (lDist >= 7760 && lDist <= 7985) { return 'Breidscheid'; }
		if (lDist >= 7986 && lDist <= 8155) { return 'Ex-Mühle'; }
		if (lDist >= 8500 && lDist <= 8635) { return 'Lauda links'; }
		if (lDist >= 8735 && lDist <= 8965) { return 'Bergwerk'; }
		if (lDist >= 9715 && lDist <= 10605) { return 'Kesselchen'; }
		if (lDist >= 10645 && lDist <= 10900) { return 'Mutkurve'; }
		if (lDist >= 11205 && lDist <= 11375) { return 'Klostertal'; }
		if (lDist >= 11440 && lDist <= 11805) { return 'Steilstrecke'; }
		if (lDist >= 11855 && lDist <= 12045) { return 'Caracciola-Karussell'; }
		if (lDist >= 12645 && lDist <= 13025) { return 'Hohe Acht'; }
		if (lDist >= 13200 && lDist <= 13450) { return 'Hedwigshöhe'; }
		if (lDist >= 13451 && lDist <= 13790) { return 'Wippermann'; }
		if (lDist >= 13870 && lDist <= 14040) { return 'Eschbach'; }
		if (lDist >= 14055 && lDist <= 14440) { return 'Brünnchen'; }
		if (lDist >= 14550 && lDist <= 14740) { return 'Eiskurve'; }
		if (lDist >= 15090 && lDist <= 15370) { return 'Pflanzgarten'; }
		if (lDist >= 15550 && lDist <= 15745) { return 'Sprunghügel'; }
		if (lDist >= 15746 && lDist <= 16260) { return 'Stefan-Bellof-S'; }
		if (lDist >= 16261 && lDist <= 16690) { return 'Schwalbenschwanz'; }
		if (lDist >= 16780 && lDist <= 16940) { return 'Kleines Karussell'; }
		if (lDist >= 17170 && lDist <= 17590) { return 'Galgenkopf'; }
		if (lDist >= 17720 && lDist <= 19525) { return 'Döttinger Höhe'; }
		if (lDist >= 19526 && lDist <= 19840) { return 'Antoniusbuche'; }
		if (lDist >= 19960 && lDist <= 20265) { return 'Tiergarten'; }
		if (lDist >= 20315 && lDist <= 20550) { return 'Hohenrain Schikane'; }
		if (lDist >= 20580 && lDist <= 20645) { return 'T13'; }

		//  NORDSCHLEIFE VLN
	} else if (layoutId === 4975) {
		if (lDist >= 24080 || lDist <= 407) { return 'Start-Finish'; }
		if (lDist >= 570 && lDist <= 680) { return 'Yokohama S'; }
		if (lDist >= 690 && lDist <= 1260) { return 'Mercedes Arena'; }
		if (lDist >= 1815 && lDist <= 1950) { return 'Ravenol Kurve'; }
		if (lDist >= 2010 && lDist <= 2200) { return 'Bilstein Kurve'; }
		if (lDist >= 2440 && lDist <= 2650) { return 'Advan Bogen'; }
		if (lDist >= 2890 && lDist <= 3150) { return 'Veedol-Schikane'; }
		if (lDist >= 3260 && lDist <= 3355) { return 'Einfahrt Nordschleife'; }
		if (lDist >= 3356 && lDist <= 3555) { return 'T13'; }
		if (lDist >= 3785 && lDist <= 3915) { return 'Hatzenbachbogen'; }
		if (lDist >= 4160 && lDist <= 4890) { return 'Hatzenbach'; }
		if (lDist >= 4900 && lDist <= 5230) { return 'Hocheichen'; }
		if (lDist >= 5231 && lDist <= 5515) { return 'Quiddelbacher Höhe'; }
		if (lDist >= 5516 && lDist <= 5765) { return 'Flugplatz'; }
		if (lDist >= 5766 && lDist <= 6155) { return 'Kottenborn'; }
		if (lDist >= 6715 && lDist <= 6980) { return 'Schwedenkreuz'; }
		if (lDist >= 7070 && lDist <= 7260) { return 'Aremberg'; }
		if (lDist >= 7350 && lDist <= 8095) { return 'Fuchsröhre'; }
		if (lDist >= 8300 && lDist <= 8620) { return 'Adenauer Forst'; }
		if (lDist >= 9065 && lDist <= 9525) { return 'Metzgesfeld'; }
		if (lDist >= 9690 && lDist <= 9855) { return 'Kallenhard'; }
		if (lDist >= 9990 && lDist <= 10160) { return 'Spiegelkurve'; }
		if (lDist >= 10205 && lDist <= 10470) { return '3 fach rechts'; }
		if (lDist >= 10580 && lDist <= 10835) { return 'Wehrseifen'; }
		if (lDist >= 11140 && lDist <= 11365) { return 'Breidscheid'; }
		if (lDist >= 11366 && lDist <= 11535) { return 'Ex-Mühle'; }
		if (lDist >= 11880 && lDist <= 12015) { return 'Lauda links'; }
		if (lDist >= 12115 && lDist <= 12345) { return 'Bergwerk'; }
		if (lDist >= 13095 && lDist <= 13985) { return 'Kesselchen'; }
		if (lDist >= 14025 && lDist <= 14280) { return 'Mutkurve'; }
		if (lDist >= 14585 && lDist <= 14755) { return 'Klostertal'; }
		if (lDist >= 14820 && lDist <= 15185) { return 'Steilstrecke'; }
		if (lDist >= 15235 && lDist <= 15425) { return 'Caracciola-Karussell'; }
		if (lDist >= 16025 && lDist <= 16405) { return 'Hohe Acht'; }
		if (lDist >= 16580 && lDist <= 16830) { return 'Hedwigshöhe'; }
		if (lDist >= 16831 && lDist <= 17170) { return 'Wippermann'; }
		if (lDist >= 17250 && lDist <= 17420) { return 'Eschbach'; }
		if (lDist >= 17435 && lDist <= 17820) { return 'Brünnchen'; }
		if (lDist >= 17930 && lDist <= 18120) { return 'Eiskurve'; }
		if (lDist >= 18470 && lDist <= 18750) { return 'Pflanzgarten'; }
		if (lDist >= 18930 && lDist <= 19125) { return 'Sprunghügel'; }
		if (lDist >= 19126 && lDist <= 19640) { return 'Stefan-Bellof-S'; }
		if (lDist >= 19641 && lDist <= 20070) { return 'Schwalbenschwanz'; }
		if (lDist >= 20160 && lDist <= 20320) { return 'Kleines Karussell'; }
		if (lDist >= 20550 && lDist <= 20970) { return 'Galgenkopf'; }
		if (lDist >= 21100 && lDist <= 22905) { return 'Döttinger Höhe'; }
		if (lDist >= 22906 && lDist <= 23220) { return 'Antoniusbuche'; }
		if (lDist >= 23340 && lDist <= 23645) { return 'Tiergarten'; }
		if (lDist >= 23695 && lDist <= 23985) { return 'Hohenrain Schikane'; }

		//  NORDSCHLEIFE Tourist
	} else if (layoutId === 5093) {
		if (lDist >= 20545 || lDist <= 20) { return 'Start'; }
		if (lDist >= 40 && lDist <= 245) { return 'Antoniusbuche'; }
		if (lDist >= 305 && lDist <= 600) { return 'Tiergarten'; }
		if (lDist >= 660 && lDist <= 890) { return 'Hohenrain Schikane'; }
		if (lDist >= 930 && lDist <= 1300) { return 'T13'; }
		if (lDist >= 4415 && lDist <= 4715) { return 'Hatzenbachbogen'; }
		if (lDist >= 4815 && lDist <= 5665) { return 'Hatzenbach'; }
		if (lDist >= 5715 && lDist <= 5965) { return 'Hocheichen'; }
		if (lDist >= 6145 && lDist <= 6515) { return 'Quiddelbacher Höhe'; }
		if (lDist >= 6565 && lDist <= 6865) { return 'Flugplatz'; }
		if (lDist >= 7020 && lDist <= 7665) { return 'Kottenborn'; }
		if (lDist >= 7730 && lDist <= 7995) { return 'Schwedenkreuz'; }
		if (lDist >= 8085 && lDist <= 8305) { return 'Aremberg'; }
		if (lDist >= 8365 && lDist <= 9210) { return 'Fuchsröhre'; }
		if (lDist >= 9315 && lDist <= 9665) { return 'Adenauer Forst'; }
		if (lDist >= 10190 && lDist <= 10605) { return 'Metzgesfeld'; }
		if (lDist >= 10705 && lDist <= 10890) { return 'Kallenhard'; }
		if (lDist >= 11015 && lDist <= 11160) { return 'Spiegelkurve'; }
		if (lDist >= 11215 && lDist <= 11465) { return '3 fach rechts'; }
		if (lDist >= 11585 && lDist <= 11885) { return 'Wehrseifen'; }
		if (lDist >= 12015 && lDist <= 12355) { return 'Breidscheid'; }
		if (lDist >= 12385 && lDist <= 12565) { return 'Ex-Mühle'; }
		if (lDist >= 12905 && lDist <= 13015) { return 'Lauda links'; }
		if (lDist >= 13115 && lDist <= 13365) { return 'Bergwerk'; }
		if (lDist >= 13515 && lDist <= 14815) { return 'Kesselchen'; }
		if (lDist >= 14915 && lDist <= 15315) { return 'Mutkurve'; }
		if (lDist >= 15380 && lDist <= 15665) { return 'Klostertal'; }
		if (lDist >= 15795 && lDist <= 16015) { return 'Steilstrecke'; }
		if (lDist >= 16225 && lDist <= 16425) { return 'Caracciola-Karussell'; }
		if (lDist >= 17045 && lDist <= 17485) { return 'Hohe Acht'; }
		if (lDist >= 17585 && lDist <= 17885) { return 'Hedwigshöhe'; }
		if (lDist >= 17965 && lDist <= 18195) { return 'Wippermann'; }
		if (lDist >= 18245 && lDist <= 18405) { return 'Eschbach'; }
		if (lDist >= 18445 && lDist <= 18875) { return 'Brünnchen'; }
		if (lDist >= 18915 && lDist <= 19130) { return 'Eiskurve'; }
		if (lDist >= 19260 && lDist <= 19845) { return 'Pflanzgarten'; }
		if (lDist >= 19940 && lDist <= 20100) { return 'Sprunghügel'; }
		if (lDist >= 20140 && lDist <= 20865) { return 'Stefan-Bellof-S'; }
		if (lDist >= 20915 && lDist <= 21105) { return 'Schwalbenschwanz'; }
		if (lDist >= 21165 && lDist <= 21290) { return 'Kleines Karussell'; }
		if (lDist >= 21555 && lDist <= 21935) { return 'Galgenkopf'; }
		if (lDist >= 18750 && lDist <= 19040) { return 'Finish'; }

		//  NORDSCHLEIFE 24H
	} else if (layoutId === 5095) {
		if (lDist >= 25095 || lDist <= 407) { return 'Start-Finish'; }
		if (lDist >= 570 && lDist <= 820) { return 'Yokohama S'; }
		if (lDist >= 1260 && lDist <= 1470) { return 'Ford Kurve'; }
		if (lDist >= 1830 && lDist <= 2075) { return 'Dunlop Kehre'; }
		if (lDist >= 2230 && lDist <= 2570) { return 'Michael-Schumacher-S'; }
		if (lDist >= 2835 && lDist <= 2970) { return 'Ravenol Kurve'; }
		if (lDist >= 3010 && lDist <= 3235) { return 'Bilstein Kurve'; }
		if (lDist >= 3450 && lDist <= 3660) { return 'Advan Bogen'; }
		if (lDist >= 3960 && lDist <= 4160) { return 'Veedol-Schikane'; }
		if (lDist >= 4275 && lDist <= 4370) { return 'Einfahrt Nordschleife'; }
		if (lDist >= 4371 && lDist <= 4570) { return 'T13'; }
		if (lDist >= 4800 && lDist <= 4930) { return 'Hatzenbachbogen'; }
		if (lDist >= 5175 && lDist <= 5905) { return 'Hatzenbach'; }
		if (lDist >= 5915 && lDist <= 6245) { return 'Hocheichen'; }
		if (lDist >= 6246 && lDist <= 6530) { return 'Quiddelbacher Höhe'; }
		if (lDist >= 6531 && lDist <= 6780) { return 'Flugplatz'; }
		if (lDist >= 6781 && lDist <= 7170) { return 'Kottenborn'; }
		if (lDist >= 7730 && lDist <= 7995) { return 'Schwedenkreuz'; }
		if (lDist >= 8085 && lDist <= 8275) { return 'Aremberg'; }
		if (lDist >= 8365 && lDist <= 9110) { return 'Fuchsröhre'; }
		if (lDist >= 9315 && lDist <= 9635) { return 'Adenauer Forst'; }
		if (lDist >= 10080 && lDist <= 10540) { return 'Metzgesfeld'; }
		if (lDist >= 10705 && lDist <= 10870) { return 'Kallenhard'; }
		if (lDist >= 11005 && lDist <= 11175) { return 'Spiegelkurve'; }
		if (lDist >= 11220 && lDist <= 11485) { return '3 fach rechts'; }
		if (lDist >= 11595 && lDist <= 11850) { return 'Wehrseifen'; }
		if (lDist >= 12155 && lDist <= 12380) { return 'Breidscheid'; }
		if (lDist >= 12381 && lDist <= 12550) { return 'Ex-Mühle'; }
		if (lDist >= 12895 && lDist <= 13030) { return 'Lauda links'; }
		if (lDist >= 13130 && lDist <= 13360) { return 'Bergwerk'; }
		if (lDist >= 14110 && lDist <= 15000) { return 'Kesselchen'; }
		if (lDist >= 15040 && lDist <= 15295) { return 'Mutkurve'; }
		if (lDist >= 15600 && lDist <= 15770) { return 'Klostertal'; }
		if (lDist >= 15835 && lDist <= 16200) { return 'Steilstrecke'; }
		if (lDist >= 16250 && lDist <= 16440) { return 'Caracciola-Karussell'; }
		if (lDist >= 17040 && lDist <= 17420) { return 'Hohe Acht'; }
		if (lDist >= 17595 && lDist <= 17845) { return 'Hedwigshöhe'; }
		if (lDist >= 17846 && lDist <= 18185) { return 'Wippermann'; }
		if (lDist >= 18265 && lDist <= 18435) { return 'Eschbach'; }
		if (lDist >= 18450 && lDist <= 18835) { return 'Brünnchen'; }
		if (lDist >= 18945 && lDist <= 19135) { return 'Eiskurve'; }
		if (lDist >= 19485 && lDist <= 19765) { return 'Pflanzgarten'; }
		if (lDist >= 19945 && lDist <= 20140) { return 'Sprunghügel'; }
		if (lDist >= 20141 && lDist <= 20655) { return 'Stefan-Bellof-S'; }
		if (lDist >= 20656 && lDist <= 21085) { return 'Schwalbenschwanz'; }
		if (lDist >= 21175 && lDist <= 21335) { return 'Kleines Karussell'; }
		if (lDist >= 21565 && lDist <= 21985) { return 'Galgenkopf'; }
		if (lDist >= 22115 && lDist <= 23920) { return 'Döttinger Höhe'; }
		if (lDist >= 23921 && lDist <= 24235) { return 'Antoniusbuche'; }
		if (lDist >= 24355 && lDist <= 24660) { return 'Tiergarten'; }
		if (lDist >= 24710 && lDist <= 25000) { return 'Hohenrain Schikane'; }

		// Norisring
	} else if (layoutId === 2518) {
		if (lDist >= 1840 || lDist <= 80) { return 'Start-Finish'; }
		if (lDist >= 440 && lDist <= 550) { return 'Grundig Kehre'; }
		if (lDist >= 850 && lDist <= 1050) { return 'Schöller S'; }
		if (lDist >= 1560 && lDist <= 1670) { return 'Dutzenteich Kehre'; }

		// Nürburgring GP
	} else if (layoutId === 1691) {
		if (lDist >= 4941 || lDist <= 407) { return 'Start-Finish'; }
		if (lDist >= 570 && lDist <= 680) { return 'Yokohama S'; }
		if (lDist >= 690 && lDist <= 1280) { return 'Mercedes Arena'; }
		if (lDist >= 1790 && lDist <= 1920) { return 'Ford Kurve'; }
		if (lDist >= 2370 && lDist <= 2560) { return 'Dunlop Kehre'; }
		if (lDist >= 2760 && lDist <= 3060) { return 'Michael-Schumacher-S'; }
		if (lDist >= 3350 && lDist <= 3480) { return 'Ravenol Kurve'; }
		if (lDist >= 3540 && lDist <= 3700) { return 'Bilstein Kurve'; }
		if (lDist >= 3960 && lDist <= 4150) { return 'Advan Bogen'; }
		if (lDist >= 4460 && lDist <= 4600) { return 'Veedol-Schikane'; }
		if (lDist >= 4760 && lDist <= 4940) { return 'Jaguar Kurve'; }

		// Nürburgring GP Fast Chicane
	} else if (layoutId === 2010) {
		if (lDist >= 4931 || lDist <= 407) { return 'Start-Finish'; }
		if (lDist >= 570 && lDist <= 680) { return 'Yokohama S'; }
		if (lDist >= 690 && lDist <= 1280) { return 'Mercedes Arena'; }
		if (lDist >= 1790 && lDist <= 1920) { return 'Ford Kurve'; }
		if (lDist >= 2370 && lDist <= 2560) { return 'Dunlop Kehre'; }
		if (lDist >= 2760 && lDist <= 3060) { return 'Michael-Schumacher-S'; }
		if (lDist >= 3350 && lDist <= 3480) { return 'Ravenol Kurve'; }
		if (lDist >= 3540 && lDist <= 3700) { return 'Bilstein Kurve'; }
		if (lDist >= 3960 && lDist <= 4150) { return 'Advan Bogen'; }
		if (lDist >= 4400 && lDist <= 4660) { return 'Veedol-Schikane'; }
		if (lDist >= 4750 && lDist <= 4930) { return 'Jaguar Kurve'; }

		// Nürburgring Sprint Fast Chicane
	} else if (layoutId === 2011) {
		if (lDist >= 3421 || lDist <= 407) { return 'Start-Finish'; }
		if (lDist >= 570 && lDist <= 680) { return 'Yokohama S'; }
		if (lDist >= 690 && lDist <= 1260) { return 'Mercedes Arena'; }
		if (lDist >= 1815 && lDist <= 1950) { return 'Ravenol Kurve'; }
		if (lDist >= 2010 && lDist <= 2200) { return 'Bilstein Kurve'; }
		if (lDist >= 2440 && lDist <= 2650) { return 'Advan Bogen'; }
		if (lDist >= 2890 && lDist <= 3150) { return 'Veedol-Schikane'; }
		if (lDist >= 3220 && lDist <= 3420) { return 'Jaguar Kurve'; }

		// Nürburgring Sprint
	} else if (layoutId === 3377) {
		if (lDist >= 3431 || lDist <= 407) { return 'Start-Finish'; }
		if (lDist >= 570 && lDist <= 680) { return 'Yokohama S'; }
		if (lDist >= 690 && lDist <= 1260) { return 'Mercedes Arena'; }
		if (lDist >= 1815 && lDist <= 1950) { return 'Ravenol Kurve'; }
		if (lDist >= 2010 && lDist <= 2200) { return 'Bilstein Kurve'; }
		if (lDist >= 2440 && lDist <= 2650) { return 'Advan Bogen'; }
		if (lDist >= 2950 && lDist <= 3090) { return 'Veedol-Schikane'; }
		if (lDist >= 3230 && lDist <= 3430) { return 'Jaguar Kurve'; }

		// Paul Ricard Solution 3C
	} else if (layoutId === 2867) {
		if (lDist >= 3645 || lDist <= 300) { return 'Start-Finish'; }
		if (lDist >= 685 && lDist <= 900) { return 'Mistral Straight'; }
		if (lDist >= 950 && lDist <= 1165) { return 'Chicane 2'; }
		if (lDist >= 1265 && lDist <= 1810) { return 'Mistral Straight'; }
		if (lDist >= 1811 && lDist <= 2070) { return 'Signes'; }
		if (lDist >= 2255 && lDist <= 2630) { return 'Beausset'; }
		if (lDist >= 2745 && lDist <= 2945) { return 'Bendor'; }
		if (lDist >= 2946 && lDist <= 3275) { return 'Village'; }
		if (lDist >= 3276 && lDist <= 3485) { return 'Tour'; }
		if (lDist >= 3486 && lDist <= 3580) { return 'Virage du Pont'; }

		// Paul Ricard Solution 1A
	} else if (layoutId === 4246) {
		if (lDist >= 5580 || lDist <= 300) { return 'Start-Finish'; }
		if (lDist >= 600 && lDist <= 950) { return 'Verriere'; }
		if (lDist >= 1230 && lDist <= 1450) { return 'Chicane'; }
		if (lDist >= 1460 && lDist <= 1815) { return 'Saint-Beaurne'; }
		if (lDist >= 1816 && lDist <= 1960) { return 'Lecole'; }
		if (lDist >= 1961 && lDist <= 3720) { return 'Mistral Straight'; }
		if (lDist >= 3721 && lDist <= 4000) { return 'Signes'; }
		if (lDist >= 4170 && lDist <= 4580) { return 'Beausset'; }
		if (lDist >= 4665 && lDist <= 4880) { return 'Bendor'; }
		if (lDist >= 4881 && lDist <= 5200) { return 'Village'; }
		if (lDist >= 5201 && lDist <= 5415) { return 'Tour'; }
		if (lDist >= 5416 && lDist <= 5515) { return 'Virage du Pont'; }

		// Paul Ricard Solution 1C-V2
	} else if (layoutId === 4247) {
		if (lDist >= 5665 || lDist <= 300) { return 'Start-Finish'; }
		if (lDist >= 590 && lDist <= 890) { return 'Verriere'; }
		if (lDist >= 1280 && lDist <= 1490) { return 'Chicane'; }
		if (lDist >= 1500 && lDist <= 1860) { return 'Saint-Beaurne'; }
		if (lDist >= 1861 && lDist <= 1995) { return 'Lecole'; }
		if (lDist >= 1996 && lDist <= 2925) { return 'Mistral Straight'; }
		if (lDist >= 2955 && lDist <= 3200) { return 'Chicane 2'; }
		if (lDist >= 3300 && lDist <= 3820) { return 'Mistral Straight'; }
		if (lDist >= 3821 && lDist <= 4100) { return 'Signes'; }
		if (lDist >= 4275 && lDist <= 4650) { return 'Beausset'; }
		if (lDist >= 4755 && lDist <= 4965) { return 'Bendor'; }
		if (lDist >= 4966 && lDist <= 5300) { return 'Village'; }
		if (lDist >= 5301 && lDist <= 5510) { return 'Tour'; }
		if (lDist >= 5511 && lDist <= 5600) { return 'Virage du Pont'; }

		// Paul Ricard Solution 2A Short
	} else if (layoutId === 4248) {
		if (lDist >= 3275 || lDist <= 300) { return 'Start-Finish'; }
		if (lDist >= 880 && lDist <= 2020) { return 'Mistral Straight'; }
		if (lDist >= 2021 && lDist <= 2280) { return 'Signes'; }
		if (lDist >= 2435 && lDist <= 2570) { return 'Bendor'; }
		if (lDist >= 2571 && lDist <= 2900) { return 'Village'; }
		if (lDist >= 2901 && lDist <= 3115) { return 'Tour'; }
		if (lDist >= 3116 && lDist <= 3210) { return 'Virage du Pont'; }

		// Portimao GP
	} else if (layoutId === 1778) {
		if (lDist >= 4180 || lDist <= 135) { return 'Start-Finish'; }
		if (lDist >= 365 && lDist <= 450) { return 'Primeira'; }
		if (lDist >= 525 && lDist <= 610) { return 'Turn 2'; }
		if (lDist >= 690 && lDist <= 780) { return 'Lagos'; }
		if (lDist >= 815 && lDist <= 945) { return 'Turn 4'; }
		if (lDist >= 1405 && lDist <= 1500) { return 'Torre Vip'; }
		if (lDist >= 1620 && lDist <= 1755) { return 'Turn 6'; }
		if (lDist >= 1865 && lDist <= 1970) { return 'Turn 7'; }
		if (lDist >= 2015 && lDist <= 2130) { return 'Samsung'; }
		if (lDist >= 2360 && lDist <= 2510) { return 'Craig Jones'; }
		if (lDist >= 2620 && lDist <= 2800) { return 'Portimao'; }
		if (lDist >= 2895 && lDist <= 3040) { return 'Turn 11'; }
		if (lDist >= 3130 && lDist <= 3255) { return 'Turn 12'; }
		if (lDist >= 3340 && lDist <= 3565) { return 'Sagres'; }
		if (lDist >= 3685 && lDist <= 4070) { return 'Galp'; }
		if (lDist >= 2400 && lDist <= 2540) { return 'Turn 15'; }
		if (lDist >= 2541 && lDist <= 2690) { return 'Turn 16'; }
		if (lDist >= 3630 && lDist <= 3740) { return 'Turn 17'; }

		// Portimao National
	} else if (layoutId === 1783) {
		if (lDist >= 3705 || lDist <= 135) { return 'Start-Finish'; }
		if (lDist >= 365 && lDist <= 450) { return 'Primeira'; }
		if (lDist >= 525 && lDist <= 610) { return 'Turn 2'; }
		if (lDist >= 690 && lDist <= 780) { return 'Lagos'; }
		if (lDist >= 815 && lDist <= 945) { return 'Turn 4'; }
		if (lDist >= 1405 && lDist <= 1500) { return 'Torre Vip'; }
		if (lDist >= 1620 && lDist <= 1725) { return 'Turn 6'; }
		if (lDist >= 1726 && lDist <= 1880) { return 'Turn 7'; }
		if (lDist >= 1915 && lDist <= 2070) { return 'Craig Jones'; }
		if (lDist >= 2160 && lDist <= 2355) { return 'Portimao'; }
		if (lDist >= 2445 && lDist <= 2585) { return 'Turn 10'; }
		if (lDist >= 2680 && lDist <= 2800) { return 'Turn 11'; }
		if (lDist >= 2895 && lDist <= 3115) { return 'Sagres'; }
		if (lDist >= 3225 && lDist <= 3320) { return 'Turn 13'; }
		if (lDist >= 3425 && lDist <= 3590) { return 'Turn 14'; }

		// Portimao Club
	} else if (layoutId === 1784) {
		if (lDist >= 3445 || lDist <= 135) { return 'Start-Finish'; }
		if (lDist >= 365 && lDist <= 450) { return 'Primeira'; }
		if (lDist >= 525 && lDist <= 610) { return 'Turn 2'; }
		if (lDist >= 690 && lDist <= 780) { return 'Lagos'; }
		if (lDist >= 815 && lDist <= 945) { return 'Turn 4'; }
		if (lDist >= 1320 && lDist <= 1455) { return 'Turn 5'; }
		if (lDist >= 1500 && lDist <= 1590) { return 'Turn 6'; }
		if (lDist >= 1591 && lDist <= 1750) { return 'Turn 7'; }
		if (lDist >= 1785 && lDist <= 1925) { return 'Craig Jones'; }
		if (lDist >= 2035 && lDist <= 2220) { return 'Portimao'; }
		if (lDist >= 2295 && lDist <= 2490) { return 'Turn 10'; }
		if (lDist >= 2525 && lDist <= 2590) { return 'Turn 11'; }
		if (lDist >= 2615 && lDist <= 2835) { return 'Sagres'; }
		if (lDist >= 2945 && lDist <= 3325) { return 'Galp'; }

		// Portimao Club Chicane
	} else if (layoutId === 1785) {
		if (lDist >= 3435 || lDist <= 135) { return 'Start-Finish'; }
		if (lDist >= 365 && lDist <= 500) { return 'Chicane'; }
		if (lDist >= 540 && lDist <= 620) { return 'Turn 2'; }
		if (lDist >= 710 && lDist <= 800) { return 'Lagos'; }
		if (lDist >= 830 && lDist <= 965) { return 'Turn 4'; }
		if (lDist >= 1330 && lDist <= 1455) { return 'Turn 5'; }
		if (lDist >= 1515 && lDist <= 1615) { return 'Turn 6'; }
		if (lDist >= 1616 && lDist <= 1765) { return 'Turn 7'; }
		if (lDist >= 1800 && lDist <= 1935) { return 'Craig Jones'; }
		if (lDist >= 2045 && lDist <= 2240) { return 'Portimao'; }
		if (lDist >= 2335 && lDist <= 2510) { return 'Turn 10'; }
		if (lDist >= 2545 && lDist <= 2625) { return 'Turn 11'; }
		if (lDist >= 2626 && lDist <= 2855) { return 'Sagres'; }
		if (lDist >= 2955 && lDist <= 3050) { return 'Turn 13'; }
		if (lDist >= 3165 && lDist <= 3320) { return 'Turn 14'; }

		// RaceRoom Raceway GP
	} else if (layoutId === 263) {
		if (lDist >= 3526 || lDist <= 80) { return 'Start-Finish'; }
		if (lDist >= 81 && lDist <= 240) { return 'Turn 1'; }
		if (lDist >= 470 && lDist <= 610) { return 'Chicane 1'; }
		if (lDist >= 885 && lDist <= 1015) { return 'Chicane 2'; }
		if (lDist >= 1025 && lDist <= 1330) { return 'Turn 4'; }
		if (lDist >= 1400 && lDist <= 1715) { return 'Turn 5'; }
		if (lDist >= 1880 && lDist <= 2030) { return 'Turn 6'; }
		if (lDist >= 2075 && lDist <= 2185) { return 'Turn 7'; }
		if (lDist >= 2186 && lDist <= 2305) { return 'Turn 8'; }
		if (lDist >= 2335 && lDist <= 2545) { return 'Chicane 3'; }
		if (lDist >= 2835 && lDist <= 2940) { return 'Turn 10'; }
		if (lDist >= 3000 && lDist <= 3110) { return 'Turn 11'; }
		if (lDist >= 3180 && lDist <= 3270) { return 'Turn 12'; }
		if (lDist >= 3390 && lDist <= 3525) { return 'Turn 13'; }

		// RaceRoom Raceway Classic
	} else if (layoutId === 264) {
		if (lDist >= 3571 || lDist <= 80) { return 'Start-Finish'; }
		if (lDist >= 81 && lDist <= 240) { return 'Turn 1'; }
		if (lDist >= 470 && lDist <= 610) { return 'Chicane 1'; }
		if (lDist >= 885 && lDist <= 1015) { return 'Chicane 2'; }
		if (lDist >= 1025 && lDist <= 1330) { return 'Turn 4'; }
		if (lDist >= 1400 && lDist <= 1715) { return 'Turn 5'; }
		if (lDist >= 1880 && lDist <= 2030) { return 'Turn 6'; }
		if (lDist >= 2075 && lDist <= 2185) { return 'Turn 7'; }
		if (lDist >= 2186 && lDist <= 2305) { return 'Turn 8'; }
		if (lDist >= 2380 && lDist <= 2580) { return 'Chicane 3'; }
		if (lDist >= 2865 && lDist <= 2975) { return 'Turn 10'; }
		if (lDist >= 3035 && lDist <= 3150) { return 'Turn 11'; }
		if (lDist >= 3220 && lDist <= 3310) { return 'Turn 12'; }
		if (lDist >= 3430 && lDist <= 3570) { return 'Turn 13'; }

		// RaceRoom Raceway Classic Sprint
	} else if (layoutId === 265) {
		if (lDist >= 3371 || lDist <= 80) { return 'Start-Finish'; }
		if (lDist >= 81 && lDist <= 240) { return 'Turn 1'; }
		if (lDist >= 470 && lDist <= 610) { return 'Chicane 1'; }
		if (lDist >= 885 && lDist <= 1015) { return 'Chicane 2'; }
		if (lDist >= 1025 && lDist <= 1330) { return 'Turn 4'; }
		if (lDist >= 1400 && lDist <= 1715) { return 'Turn 5'; }
		if (lDist >= 1880 && lDist <= 2030) { return 'Turn 6'; }
		if (lDist >= 2075 && lDist <= 2185) { return 'Turn 7'; }
		if (lDist >= 2186 && lDist <= 2305) { return 'Turn 8'; }
		if (lDist >= 2380 && lDist <= 2580) { return 'Chicane 3'; }
		if (lDist >= 2865 && lDist <= 2975) { return 'Turn 10'; }
		if (lDist >= 3150 && lDist <= 3370) { return 'Turn 11'; }

		// RaceRoom Raceway Bridge
	} else if (layoutId === 266) {
		if (lDist >= 3086 || lDist <= 80) { return 'Start-Finish'; }
		if (lDist >= 81 && lDist <= 240) { return 'Turn 1'; }
		if (lDist >= 470 && lDist <= 610) { return 'Chicane 1'; }
		if (lDist >= 885 && lDist <= 1015) { return 'Chicane 2'; }
		if (lDist >= 1025 && lDist <= 1330) { return 'Turn 4'; }
		if (lDist >= 1400 && lDist <= 1715) { return 'Turn 5'; }
		if (lDist >= 1880 && lDist <= 2030) { return 'Turn 6'; }
		if (lDist >= 2075 && lDist <= 2185) { return 'Turn 7'; }
		if (lDist >= 2186 && lDist <= 2305) { return 'Turn 8'; }
		if (lDist >= 2935 && lDist <= 3085) { return 'Turn 9'; }

		// RaceRoom Raceway National
	} else if (layoutId === 267) {
		if (lDist >= 3346 || lDist <= 80) { return 'Start-Finish'; }
		if (lDist >= 81 && lDist <= 240) { return 'Turn 1'; }
		if (lDist >= 470 && lDist <= 610) { return 'Chicane 1'; }
		if (lDist >= 885 && lDist <= 1015) { return 'Chicane 2'; }
		if (lDist >= 1025 && lDist <= 1330) { return 'Turn 4'; }
		if (lDist >= 1400 && lDist <= 1715) { return 'Turn 5'; }
		if (lDist >= 1880 && lDist <= 2030) { return 'Turn 6'; }
		if (lDist >= 2075 && lDist <= 2185) { return 'Turn 7'; }
		if (lDist >= 2186 && lDist <= 2305) { return 'Turn 8'; }
		if (lDist >= 2335 && lDist <= 2545) { return 'Chicane 3'; }
		if (lDist >= 2835 && lDist <= 2940) { return 'Turn 10'; }
		if (lDist >= 3125 && lDist <= 3345) { return 'Turn 11'; }

		// RedBull Ring GP
	} else if (layoutId === 2556) {
		if (lDist >= 4020 || lDist <= 180) { return 'Start-Finish'; }
		if (lDist >= 285 && lDist <= 390) { return 'Castrol Edge'; }
		if (lDist >= 1220 && lDist <= 1330) { return 'Remus'; }
		if (lDist >= 2025 && lDist <= 2135) { return 'Schlossgold'; }
		if (lDist >= 2485 && lDist <= 2720) { return 'Rauch'; }
		if (lDist >= 2820 && lDist <= 3015) { return 'Würth Kurve'; }
		if (lDist >= 3580 && lDist <= 3720) { return 'Rindt'; }
		if (lDist >= 3810 && lDist <= 3990) { return 'Red Bull Mobile'; }

		// RedBull Ring Südschleife National
	} else if (layoutId === 5794) {
		if (lDist >= 2040 || lDist <= 180) { return 'Start-Finish'; }
		if (lDist >= 285 && lDist <= 390) { return 'Castrol Edge'; }
		if (lDist >= 650 && lDist <= 845) { return 'Turn 2'; }
		if (lDist >= 846 && lDist <= 1040) { return 'Würth Kurve'; }
		if (lDist >= 1605 && lDist <= 1740) { return 'Rindt'; }
		if (lDist >= 1840 && lDist <= 2010) { return 'Red Bull Mobile'; }

		// Road America GP
	} else if (layoutId === 5276) {
		if (lDist >= 6245 || lDist <= 320) { return 'Start-Finish'; }
		if (lDist >= 600 && lDist <= 750) { return 'Turn 1'; }
		if (lDist >= 1075 && lDist <= 1220) { return 'Turn 2'; }
		if (lDist >= 1265 && lDist <= 2115) { return 'Moraine Sweep'; }
		if (lDist >= 2310 && lDist <= 2410) { return 'Turn 3'; }
		if (lDist >= 2605 && lDist <= 2715) { return 'Turn 4'; }
		if (lDist >= 2850 && lDist <= 2955) { return 'Turn 5'; }
		if (lDist >= 2980 && lDist <= 3270) { return 'Hurry Downs'; }
		if (lDist >= 3271 && lDist <= 3375) { return 'Turn 6'; }
		if (lDist >= 3470 && lDist <= 3970) { return 'Carousel'; }
		if (lDist >= 4250 && lDist <= 4440) { return 'The Kink'; }
		if (lDist >= 4470 && lDist <= 5010) { return 'Kettle Bottoms'; }
		if (lDist >= 5140 && lDist <= 5260) { return 'Canada Corner'; }
		if (lDist >= 5450 && lDist <= 5610) { return 'Turn 10'; }
		if (lDist >= 5770 && lDist <= 5940) { return 'Turn 11'; }

		// Sachsenring
	} else if (layoutId === 3538) {
		if (lDist >= 3370 || lDist <= 100) { return 'Start-Finish'; }
		if (lDist >= 290 && lDist <= 435) { return 'Auto Motor und Sport'; }
		if (lDist >= 620 && lDist <= 860) { return 'Omega'; }
		if (lDist >= 930 && lDist <= 1150) { return 'Kleine Kuppe'; }
		if (lDist >= 1200 && lDist <= 1460) { return 'Karthallen'; }
		if (lDist >= 1675 && lDist <= 1760) { return 'Volkswagen'; }
		if (lDist >= 1925 && lDist <= 2015) { return 'Große Kuppe'; }
		if (lDist >= 2065 && lDist <= 2170) { return 'Nordkurve'; }
		if (lDist >= 2285 && lDist <= 2390) { return 'Fahrerlager'; }
		if (lDist >= 2750 && lDist <= 2970) { return 'Sachsenkurve'; }
		if (lDist >= 3145 && lDist <= 3300) { return 'Queckenberg'; }

		// Salzburgring
	} else if (layoutId === 2026) {
		if (lDist >= 4090 || lDist <= 265) { return 'Start-Finish'; }
		if (lDist >= 650 && lDist <= 750) { return 'Schikane 1'; }
		if (lDist >= 1150 && lDist <= 1440) { return 'Nockstein-Kehre'; }
		if (lDist >= 1441 && lDist <= 2820) { return 'Gegengerade'; }
		if (lDist >= 2821 && lDist <= 3605) { return 'Fahrerlagerkurve'; }
		if (lDist >= 3650 && lDist <= 4015) { return 'Schikane 2'; }

		// Scandinavian Raceway Grand Prix
	} else if (layoutId === 5301) {
		if (lDist >= 3851 || lDist <= 60) { return 'Start-Finish'; }
		if (lDist >= 61 && lDist <= 340) { return 'Södra'; }
		if (lDist >= 341 && lDist <= 1200) { return 'Flight Straight'; }
		if (lDist >= 1201 && lDist <= 1380) { return 'Norra'; }
		if (lDist >= 1490 && lDist <= 1650) { return 'Läktar'; }
		if (lDist >= 1990 && lDist <= 2290) { return 'Start Kurvan'; }
		if (lDist >= 2470 && lDist <= 2760) { return 'Opel'; }
		if (lDist >= 3140 && lDist <= 3285) { return 'Hansen'; }
		if (lDist >= 3340 && lDist <= 3745) { return 'Karusell'; }
		if (lDist >= 3746 && lDist <= 3850) { return 'Gislaved'; }

		// Scandinavian Raceway South
	} else if (layoutId === 6164) {
		if (lDist >= 1700 || lDist <= 60) { return 'Start-Finish'; }
		if (lDist >= 61 && lDist <= 340) { return 'Södra'; }
		if (lDist >= 341 && lDist <= 805) { return 'Flight Straight'; }
		if (lDist >= 806 && lDist <= 920) { return 'South'; }
		if (lDist >= 997 && lDist <= 1140) { return 'Hansen'; }
		if (lDist >= 1200 && lDist <= 1605) { return 'Karusell'; }
		if (lDist >= 1606 && lDist <= 1699) { return 'Gislaved'; }

		// Sepang GP
	} else if (layoutId === 6341) {
		if (lDist >= 5380 || lDist <= 365) { return 'Start-Finish'; }
		if (lDist >= 570 && lDist <= 740) { return 'Turn 1'; }
		if (lDist >= 741 && lDist <= 850) { return 'Turn 2'; }
		if (lDist >= 851 && lDist <= 1200) { return 'Turn 3'; }
		if (lDist >= 1545 && lDist <= 1645) { return 'Turn 4'; }
		if (lDist >= 1825 && lDist <= 2100) { return 'Turn 5'; }
		if (lDist >= 2101 && lDist <= 2295) { return 'Turn 6'; }
		if (lDist >= 2540 && lDist <= 2610) { return 'Turn 7'; }
		if (lDist >= 2650 && lDist <= 2725) { return 'Turn 8'; }
		if (lDist >= 3130 && lDist <= 3220) { return 'Turn 9'; }
		if (lDist >= 3250 && lDist <= 3485) { return 'Turn 10'; }
		if (lDist >= 3486 && lDist <= 3590) { return 'Turn 11'; }
		if (lDist >= 3795 && lDist <= 3940) { return 'Turn 12'; }
		if (lDist >= 3941 && lDist <= 4160) { return 'Turn 13'; }
		if (lDist >= 4161 && lDist <= 4280) { return 'Turn 14'; }
		if (lDist >= 5050 && lDist <= 5250) { return 'Turn 15'; }

		// Sepang North
	} else if (layoutId === 6578) {
		if (lDist >= 2640 || lDist <= 365) { return 'Start-Finish'; }
		if (lDist >= 570 && lDist <= 740) { return 'Turn 1'; }
		if (lDist >= 741 && lDist <= 850) { return 'Turn 2'; }
		if (lDist >= 851 && lDist <= 1200) { return 'Turn 3'; }
		if (lDist >= 1545 && lDist <= 1645) { return 'Turn 4'; }
		if (lDist >= 1825 && lDist <= 2100) { return 'Turn 5'; }
		if (lDist >= 2101 && lDist <= 2350) { return 'Turn 6'; }
		if (lDist >= 2385 && lDist <= 2465) { return 'Turn 7'; }

		// Sepang South
	} else if (layoutId === 6579) {
		if (lDist >= 2209 || lDist <= 215) { return 'Start-Finish'; }
		if (lDist >= 535 && lDist <= 655) { return 'Turn 1'; }
		if (lDist >= 1058 && lDist <= 1148) { return 'Turn 9'; }
		if (lDist >= 1178 && lDist <= 1413) { return 'Turn 10'; }
		if (lDist >= 1414 && lDist <= 1518) { return 'Turn 11'; }
		if (lDist >= 1723 && lDist <= 1868) { return 'Turn 12'; }
		if (lDist >= 1869 && lDist <= 2088) { return 'Turn 13'; }
		if (lDist >= 2089 && lDist <= 2208) { return 'Turn 14'; }

		// Shanghai GP
	} else if (layoutId === 2027) {
		if (lDist >= 5200 || lDist <= 190) { return 'Start-Finish'; }
		if (lDist >= 310 && lDist <= 490) { return 'Turn 1'; }
		if (lDist >= 491 && lDist <= 685) { return 'Turn 2'; }
		if (lDist >= 686 && lDist <= 800) { return 'Turn 3'; }
		if (lDist >= 801 && lDist <= 925) { return 'Turn 4'; }
		if (lDist >= 1135 && lDist <= 1220) { return 'Turn 5'; }
		if (lDist >= 1390 && lDist <= 1480) { return 'Turn 6'; }
		if (lDist >= 1740 && lDist <= 2050) { return 'Turn 7'; }
		if (lDist >= 2095 && lDist <= 2310) { return 'Turn 8'; }
		if (lDist >= 2350 && lDist <= 2440) { return 'Turn 9'; }
		if (lDist >= 2480 && lDist <= 2550) { return 'Turn 10'; }
		if (lDist >= 2940 && lDist <= 3020) { return 'Turn 11'; }
		if (lDist >= 3021 && lDist <= 3130) { return 'Turn 12'; }
		if (lDist >= 3131 && lDist <= 3440) { return 'Turn 13'; }
		if (lDist >= 4615 && lDist <= 4675) { return 'Turn 14'; }
		if (lDist >= 4676 && lDist <= 4760) { return 'Turn 15'; }
		if (lDist >= 4985 && lDist <= 5060) { return 'Turn 16'; }

		// Shanghai Intermediate (WTCC)
	} else if (layoutId === 4041) {
		if (lDist >= 4350 || lDist <= 190) { return 'Start-Finish'; }
		if (lDist >= 310 && lDist <= 490) { return 'Turn 1'; }
		if (lDist >= 491 && lDist <= 685) { return 'Turn 2'; }
		if (lDist >= 686 && lDist <= 800) { return 'Turn 3'; }
		if (lDist >= 965 && lDist <= 1025) { return 'Turn 4'; }
		if (lDist >= 1026 && lDist <= 1100) { return 'Turn 5'; }
		if (lDist >= 1240 && lDist <= 1465) { return 'Turn 6'; }
		if (lDist >= 1510 && lDist <= 1590) { return 'Turn 7'; }
		if (lDist >= 1630 && lDist <= 1700) { return 'Turn 8'; }
		if (lDist >= 2095 && lDist <= 2175) { return 'Turn 9'; }
		if (lDist >= 2176 && lDist <= 2275) { return 'Turn 10'; }
		if (lDist >= 2276 && lDist <= 2590) { return 'Turn 11'; }
		if (lDist >= 3760 && lDist <= 3830) { return 'Turn 12'; }
		if (lDist >= 3831 && lDist <= 3910) { return 'Turn 13'; }
		if (lDist >= 4130 && lDist <= 4220) { return 'Turn 14'; }

		// Shanghai West Long
	} else if (layoutId === 4042) {
		if (lDist >= 2706 || lDist <= 190) { return 'Start-Finish'; }
		if (lDist >= 310 && lDist <= 490) { return 'Turn 1'; }
		if (lDist >= 491 && lDist <= 685) { return 'Turn 2'; }
		if (lDist >= 686 && lDist <= 800) { return 'Turn 3'; }
		if (lDist >= 801 && lDist <= 925) { return 'Turn 4'; }
		if (lDist >= 1030 && lDist <= 1225) { return 'Turn 5'; }
		if (lDist >= 1320 && lDist <= 1440) { return 'Turn 6'; }
		if (lDist >= 1625 && lDist <= 1940) { return 'Turn 7'; }
		if (lDist >= 1990 && lDist <= 2205) { return 'Turn 8'; }
		if (lDist >= 2245 && lDist <= 2310) { return 'Turn 9'; }
		if (lDist >= 2425 && lDist <= 2515) { return 'Turn 10'; }
		if (lDist >= 2516 && lDist <= 2570) { return 'Turn 11'; }
		if (lDist >= 2571 && lDist <= 2610) { return 'Turn 12'; }
		if (lDist >= 2635 && lDist <= 2705) { return 'Turn 13'; }

		// Silverstone GP
	} else if (layoutId === 4039) {
		if (lDist >= 5695 || lDist <= 210) { return 'Start-Finish'; }
		if (lDist >= 230 && lDist <= 370) { return 'Abbey'; }
		if (lDist >= 425 && lDist <= 580) { return 'Farm'; }
		if (lDist >= 725 && lDist <= 820) { return 'Village'; }
		if (lDist >= 865 && lDist <= 955) { return 'The Loop'; }
		if (lDist >= 956 && lDist <= 1085) { return 'Arena'; }
		if (lDist >= 1086 && lDist <= 1170) { return 'Aintree'; }
		if (lDist >= 1200 && lDist <= 1700) { return 'Wellington Straight'; }
		if (lDist >= 1750 && lDist <= 1925) { return 'Brooklands'; }
		if (lDist >= 1955 && lDist <= 2170) { return 'Luffield'; }
		if (lDist >= 2260 && lDist <= 2525) { return 'Woodcote'; }
		if (lDist >= 2880 && lDist <= 3060) { return 'Copse'; }
		if (lDist >= 3415 && lDist <= 3540) { return 'Maggots'; }
		if (lDist >= 3541 && lDist <= 3645) { return 'Turn 11'; }
		if (lDist >= 3690 && lDist <= 3820) { return 'Becketts'; }
		if (lDist >= 3821 && lDist <= 3985) { return 'Turn 13'; }
		if (lDist >= 4000 && lDist <= 4115) { return 'Chapel'; }
		if (lDist >= 4145 && lDist <= 4700) { return 'Hangar Straight'; }
		if (lDist >= 4825 && lDist <= 5040) { return 'Stowe'; }
		if (lDist >= 5070 && lDist <= 5300) { return 'Vale'; }
		if (lDist >= 5340 && lDist <= 5420) { return 'Turn 16'; }
		if (lDist >= 5421 && lDist <= 5500) { return 'Club'; }
		if (lDist >= 5590 && lDist <= 5680) { return 'Turn 18'; }

		// Silverstone Historic GP
	} else if (layoutId === 5862) {
		if (lDist >= 5651 || lDist <= 165) { return 'Start-Finish'; }
		if (lDist >= 166 && lDist <= 346) { return 'Copse'; }
		if (lDist >= 715 && lDist <= 830) { return 'Maggots'; }
		if (lDist >= 831 && lDist <= 935) { return 'Turn 3'; }
		if (lDist >= 980 && lDist <= 1110) { return 'Becketts'; }
		if (lDist >= 1111 && lDist <= 1275) { return 'Turn 5'; }
		if (lDist >= 1276 && lDist <= 1405) { return 'Chapel'; }
		if (lDist >= 1435 && lDist <= 1990) { return 'Hangar Straight'; }
		if (lDist >= 2115 && lDist <= 2330) { return 'Stowe'; }
		if (lDist >= 2360 && lDist <= 2490) { return 'Vale'; }
		if (lDist >= 2540 && lDist <= 2680) { return 'Turn 8'; }
		if (lDist >= 2681 && lDist <= 2760) { return 'Club'; }
		if (lDist >= 2850 && lDist <= 2940) { return 'Turn 10'; }
		if (lDist >= 3350 && lDist <= 3490) { return 'Abbey'; }
		if (lDist >= 3550 && lDist <= 3700) { return 'Farm'; }
		if (lDist >= 3850 && lDist <= 3945) { return 'Village'; }
		if (lDist >= 4000 && lDist <= 4090) { return 'The Loop'; }
		if (lDist >= 4091 && lDist <= 4205) { return 'Arena'; }
		if (lDist >= 4206 && lDist <= 4305) { return 'Aintree'; }
		if (lDist >= 4335 && lDist <= 4835) { return 'Wellington Straight'; }
		if (lDist >= 4885 && lDist <= 5060) { return 'Brooklands'; }
		if (lDist >= 5090 && lDist <= 5310) { return 'Luffield'; }
		if (lDist >= 5370 && lDist <= 5650) { return 'Woodcote'; }

		// Silverstone International
	} else if (layoutId === 5816) {
		if (lDist >= 2810 || lDist <= 210) { return 'Start-Finish'; }
		if (lDist >= 230 && lDist <= 370) { return 'Abbey'; }
		if (lDist >= 425 && lDist <= 580) { return 'Farm'; }
		if (lDist >= 725 && lDist <= 820) { return 'Village'; }
		if (lDist >= 865 && lDist <= 945) { return 'Turn 4'; }
		if (lDist >= 1030 && lDist <= 1110) { return 'Turn 5'; }
		if (lDist >= 1245 && lDist <= 1800) { return 'Hangar Straight'; }
		if (lDist >= 1925 && lDist <= 2120) { return 'Stowe'; }
		if (lDist >= 2150 && lDist <= 2380) { return 'Vale'; }
		if (lDist >= 2420 && lDist <= 2520) { return 'Turn 7'; }
		if (lDist >= 2521 && lDist <= 2600) { return 'Club'; }
		if (lDist >= 2690 && lDist <= 2780) { return 'Turn 9'; }

		// Silverstone National
	} else if (layoutId === 5817) {
		if (lDist >= 2441 || lDist <= 165) { return 'Start-Finish'; }
		if (lDist >= 166 && lDist <= 346) { return 'Copse'; }
		if (lDist >= 715 && lDist <= 830) { return 'Maggots'; }
		if (lDist >= 831 && lDist <= 925) { return 'Turn 3'; }
		if (lDist >= 926 && lDist <= 1075) { return 'Turn 4'; }
		if (lDist >= 1125 && lDist <= 1625) { return 'Wellington Straight'; }
		if (lDist >= 1675 && lDist <= 1850) { return 'Brooklands'; }
		if (lDist >= 1880 && lDist <= 2100) { return 'Luffield'; }
		if (lDist >= 2160 && lDist <= 2440) { return 'Woodcote'; }

		// Slovakia Ring GP
	} else if (layoutId === 2064) {
		if (lDist >= 5745 || lDist <= 195) { return 'Start-Finish'; }
		if (lDist >= 555 && lDist <= 780) { return 'Turn 1'; }
		if (lDist >= 1205 && lDist <= 1535) { return 'Turn 2'; }
		if (lDist >= 2050 && lDist <= 2280) { return 'Turn 3'; }
		if (lDist >= 2365 && lDist <= 2520) { return 'Turn 4'; }
		if (lDist >= 2600 && lDist <= 2775) { return 'Turn 5'; }
		if (lDist >= 2840 && lDist <= 3090) { return 'Turn 6'; }
		if (lDist >= 3100 && lDist <= 3190) { return 'Turn 7'; }
		if (lDist >= 3250 && lDist <= 3390) { return 'Turn 8'; }
		if (lDist >= 3545 && lDist <= 3820) { return 'Turn 9'; }
		if (lDist >= 4080 && lDist <= 4240) { return 'Turn 10'; }
		if (lDist >= 4241 && lDist <= 4365) { return 'Turn 11'; }
		if (lDist >= 4390 && lDist <= 4480) { return 'Turn 12'; }
		if (lDist >= 5160 && lDist <= 5550) { return 'Turn 13'; }
		if (lDist >= 5600 && lDist <= 5710) { return 'Turn 14'; }

		// Sonoma IRL
	} else if (layoutId === 3913) {
		if (lDist >= 3525 || lDist <= 55) { return 'Start-Finish'; }
		if (lDist >= 56 && lDist <= 140) { return 'Turn 1'; }
		if (lDist >= 205 && lDist <= 375) { return 'Turn 2'; }
		if (lDist >= 376 && lDist <= 500) { return 'Turn 3'; }
		if (lDist >= 660 && lDist <= 770) { return 'Turn 4'; }
		if (lDist >= 771 && lDist <= 870) { return 'Turn 5'; }
		if (lDist >= 970 && lDist <= 1065) { return 'Turn 6'; }
		if (lDist >= 1130 && lDist <= 1310) { return 'Turn 7'; }
		if (lDist >= 1425 && lDist <= 1725) { return 'Turn 8'; }
		if (lDist >= 2135 && lDist <= 2240) { return 'Turn 9'; }
		if (lDist >= 2315 && lDist <= 2385) { return 'Turn 10'; }
		if (lDist >= 2386 && lDist <= 2470) { return 'Turn 11'; }
		if (lDist >= 2471 && lDist <= 2580) { return 'Turn 12'; }
		if (lDist >= 2581 && lDist <= 2690) { return 'Turn 13'; }
		if (lDist >= 2935 && lDist <= 2983) { return 'Turn 14'; }
		if (lDist >= 2984 && lDist <= 3035) { return 'Turn 15'; }
		if (lDist >= 3100 && lDist <= 3260) { return 'Turn 16'; }
		if (lDist >= 3385 && lDist <= 3485) { return 'Turn 17'; }

		// Sonoma Long
	} else if (layoutId === 3912) {
		if (lDist >= 3891 || lDist <= 55) { return 'Start-Finish'; }
		if (lDist >= 56 && lDist <= 140) { return 'Turn 1'; }
		if (lDist >= 205 && lDist <= 375) { return 'Turn 2'; }
		if (lDist >= 376 && lDist <= 500) { return 'Turn 3'; }
		if (lDist >= 660 && lDist <= 770) { return 'Turn 4'; }
		if (lDist >= 771 && lDist <= 870) { return 'Turn 5'; }
		if (lDist >= 970 && lDist <= 1065) { return 'Turn 6'; }
		if (lDist >= 1130 && lDist <= 1310) { return 'Turn 7'; }
		if (lDist >= 1425 && lDist <= 1725) { return 'Turn 8'; }
		if (lDist >= 2135 && lDist <= 2285) { return 'Turn 9'; }
		if (lDist >= 2365 && lDist <= 2435) { return 'Turn 10'; }
		if (lDist >= 2436 && lDist <= 2520) { return 'Turn 11'; }
		if (lDist >= 2521 && lDist <= 2635) { return 'Turn 12'; }
		if (lDist >= 2636 && lDist <= 2775) { return 'Turn 13'; }
		if (lDist >= 2850 && lDist <= 3130) { return 'Turn 14'; }
		if (lDist >= 3131 && lDist <= 3280) { return 'Turn 15'; }
		if (lDist >= 3570 && lDist <= 2695) { return 'Turn 16'; }
		if (lDist >= 3810 && lDist <= 3890) { return 'Turn 17'; }

		// Sonoma Sprint
	} else if (layoutId === 2016) {
		if (lDist >= 3061 || lDist <= 55) { return 'Start-Finish'; }
		if (lDist >= 56 && lDist <= 140) { return 'Turn 1'; }
		if (lDist >= 205 && lDist <= 375) { return 'Turn 2'; }
		if (lDist >= 376 && lDist <= 500) { return 'Turn 3'; }
		if (lDist >= 660 && lDist <= 770) { return 'Turn 4'; }
		if (lDist >= 771 && lDist <= 870) { return 'Turn 5'; }
		if (lDist >= 1055 && lDist <= 1135) { return 'Turn 6'; }
		if (lDist >= 1360 && lDist <= 1460) { return 'Turn 7'; }
		if (lDist >= 1461 && lDist <= 1590) { return 'Turn 8'; }
		if (lDist >= 1591 && lDist <= 1675) { return 'Turn 9'; }
		if (lDist >= 1676 && lDist <= 1790) { return 'Turn 10'; }
		if (lDist >= 1791 && lDist <= 1950) { return 'Turn 11'; }
		if (lDist >= 2015 && lDist <= 2290) { return 'Turn 12'; }
		if (lDist >= 2291 && lDist <= 2440) { return 'Turn 13'; }
		if (lDist >= 2720 && lDist <= 2850) { return 'Turn 14'; }
		if (lDist >= 2980 && lDist <= 3060) { return 'Turn 15'; }

		// Sonoma WTCC
	} else if (layoutId === 1854) {
		if (lDist >= 3956 || lDist <= 55) { return 'Start-Finish'; }
		if (lDist >= 56 && lDist <= 140) { return 'Turn 1'; }
		if (lDist >= 205 && lDist <= 375) { return 'Turn 2'; }
		if (lDist >= 376 && lDist <= 500) { return 'Turn 3'; }
		if (lDist >= 660 && lDist <= 770) { return 'Turn 4'; }
		if (lDist >= 771 && lDist <= 870) { return 'Turn 5'; }
		if (lDist >= 970 && lDist <= 1065) { return 'Turn 6'; }
		if (lDist >= 1130 && lDist <= 1310) { return 'Turn 7'; }
		if (lDist >= 1425 && lDist <= 1725) { return 'Turn 8'; }
		if (lDist >= 2130 && lDist <= 2205) { return 'Turn 9'; }
		if (lDist >= 2240 && lDist <= 2335) { return 'Turn 10'; }
		if (lDist >= 2336 && lDist <= 2475) { return 'Turn 11'; }
		if (lDist >= 2476 && lDist <= 2560) { return 'Turn 12'; }
		if (lDist >= 2561 && lDist <= 2675) { return 'Turn 13'; }
		if (lDist >= 2676 && lDist <= 2770) { return 'Turn 14'; }
		if (lDist >= 3025 && lDist <= 3065) { return 'Turn 15'; }
		if (lDist >= 3066 && lDist <= 3105) { return 'Turn 16'; }
		if (lDist >= 3185 && lDist <= 3330) { return 'Turn 17'; }
		if (lDist >= 3620 && lDist <= 3750) { return 'Turn 18'; }
		if (lDist >= 3875 && lDist <= 3955) { return 'Turn 19'; }

		// SPA Classic
	} else if (layoutId === 4542) {
		if (lDist >= 6901 || lDist <= 190) { return 'Start-Finish'; }
		if (lDist >= 191 && lDist <= 405) { return 'Eau Rouge'; }
		if (lDist >= 406 && lDist <= 505) { return 'Raidillon'; }
		if (lDist >= 685 && lDist <= 815) { return 'Kemmel'; }
		if (lDist >= 816 && lDist <= 1515) { return 'Kemmel-Straight'; }
		if (lDist >= 1516 && lDist <= 1720) { return 'Les Combes'; }
		if (lDist >= 1770 && lDist <= 1880) { return 'Malmedy'; }
		if (lDist >= 2120 && lDist <= 2320) { return 'Rivage'; }
		if (lDist >= 2405 && lDist <= 2525) { return 'Turn 9'; }
		if (lDist >= 2910 && lDist <= 3325) { return 'Pouhon'; }
		if (lDist >= 3580 && lDist <= 3910) { return 'Fagnes'; }
		if (lDist >= 4050 && lDist <= 4175) { return 'Turn 13'; }
		if (lDist >= 4250 && lDist <= 4410) { return 'Stavelot'; }
		if (lDist >= 4925 && lDist <= 5160) { return 'Turn 15'; }
		if (lDist >= 5260 && lDist <= 5435) { return 'Blanchimont'; }
		if (lDist >= 5855 && lDist <= 6000) { return 'Bus Stop'; }
		if (lDist >= 6490 && lDist <= 6590) { return 'La Source'; }
		if (lDist >= 6685 && lDist <= 6900) { return 'Turn 20'; }

		// SPA Combined
	} else if (layoutId === 4543) {
		if (lDist >= 6901 || lDist <= 190) { return 'Start-Finish'; }
		if (lDist >= 191 && lDist <= 405) { return 'Eau Rouge'; }
		if (lDist >= 406 && lDist <= 505) { return 'Raidillon'; }
		if (lDist >= 685 && lDist <= 815) { return 'Kemmel'; }
		if (lDist >= 816 && lDist <= 1515) { return 'Kemmel-Straight'; }
		if (lDist >= 1516 && lDist <= 1720) { return 'Les Combes'; }
		if (lDist >= 1770 && lDist <= 1880) { return 'Malmedy'; }
		if (lDist >= 2120 && lDist <= 2320) { return 'Rivage'; }
		if (lDist >= 2405 && lDist <= 2525) { return 'Turn 9'; }
		if (lDist >= 2910 && lDist <= 3325) { return 'Pouhon'; }
		if (lDist >= 3580 && lDist <= 3910) { return 'Fagnes'; }
		if (lDist >= 4050 && lDist <= 4175) { return 'Turn 13'; }
		if (lDist >= 4250 && lDist <= 4410) { return 'Stavelot'; }
		if (lDist >= 4925 && lDist <= 5160) { return 'Turn 15'; }
		if (lDist >= 5260 && lDist <= 5435) { return 'Blanchimont'; }
		if (lDist >= 5855 && lDist <= 6000) { return 'Bus Stop'; }
		if (lDist >= 6490 && lDist <= 6590) { return 'La Source'; }
		if (lDist >= 6685 && lDist <= 6900) { return 'Turn 20'; }

		// SPA GP
	} else if (layoutId === 3870) {
		if (lDist >= 6800 || lDist <= 199) { return 'Start-Finish'; }
		if (lDist >= 200 && lDist <= 310) { return 'La Source'; }
		if (lDist >= 405 && lDist <= 620) { return 'Turn 2'; }
		if (lDist >= 890 && lDist <= 1105) { return 'Eau Rouge'; }
		if (lDist >= 1106 && lDist <= 1205) { return 'Raidillon'; }
		if (lDist >= 1395 && lDist <= 1510) { return 'Kemmel'; }
		if (lDist >= 1511 && lDist <= 2205) { return 'Kemmel-Straight'; }
		if (lDist >= 2206 && lDist <= 2420) { return 'Les Combes'; }
		if (lDist >= 2465 && lDist <= 2570) { return 'Malmedy'; }
		if (lDist >= 2820 && lDist <= 3020) { return 'Rivage'; }
		if (lDist >= 3100 && lDist <= 3220) { return 'Turn 11'; }
		if (lDist >= 3605 && lDist <= 4030) { return 'Pouhon'; }
		if (lDist >= 4280 && lDist <= 4610) { return 'Fagnes'; }
		if (lDist >= 4750 && lDist <= 4875) { return 'Turn 13'; }
		if (lDist >= 4950 && lDist <= 5110) { return 'Stavelot'; }
		if (lDist >= 5620 && lDist <= 5855) { return 'Turn 17'; }
		if (lDist >= 5955 && lDist <= 6145) { return 'Blanchimont'; }
		if (lDist >= 6550 && lDist <= 6700) { return 'Bus Stop'; }

		// Stowe Circuit Long
	} else if (layoutId === 6055) {
		if (lDist >= 1665 || lDist <= 115) { return 'Start-Finish'; }
		if (lDist >= 125 && lDist <= 175) { return 'Turn 1'; }
		if (lDist >= 176 && lDist <= 220) { return 'Turn 2'; }
		if (lDist >= 255 && lDist <= 355) { return 'Turn 3'; }
		if (lDist >= 356 && lDist <= 460) { return 'Turn 4'; }
		if (lDist >= 950 && lDist <= 1080) { return 'Turn 5'; }
		if (lDist >= 1125 && lDist <= 1190) { return 'Turn 6'; }
		if (lDist >= 1191 && lDist <= 1255) { return 'Turn 7'; }
		if (lDist >= 1305 && lDist <= 1355) { return 'Turn 8'; }
		if (lDist >= 1390 && lDist <= 1515) { return 'Turn 9'; }
		if (lDist >= 1516 && lDist <= 1575) { return 'Turn 10'; }

		// Stowe Circuit Short
	} else if (layoutId === 6056) {
		if (lDist >= 1220 || lDist <= 115) { return 'Start-Finish'; }
		if (lDist >= 220 && lDist <= 330) { return 'Turn 1'; }
		if (lDist >= 525 && lDist <= 630) { return 'Chicane'; }
		if (lDist >= 660 && lDist <= 780) { return 'Turn 5'; }
		if (lDist >= 830 && lDist <= 895) { return 'Turn 6'; }
		if (lDist >= 896 && lDist <= 955) { return 'Turn 7'; }
		if (lDist >= 1045 && lDist <= 1130) { return 'Turn 8'; }

		// Suzuka GP
	} else if (layoutId === 1841) {
		if (lDist >= 5461 || lDist <= 60) { return 'Start-Finish'; }
		if (lDist >= 345 && lDist <= 630) { return 'First'; }
		if (lDist >= 760 && lDist <= 1155) { return 'S'; }
		if (lDist >= 1170 && lDist <= 1350) { return 'Gyaku Bank'; }
		if (lDist >= 1390 && lDist <= 1860) { return 'Dunlop'; }
		if (lDist >= 1870 && lDist <= 2040) { return 'Degner'; }
		if (lDist >= 2125 && lDist <= 2210) { return 'Turn 9'; }
		if (lDist >= 2430 && lDist <= 2530) { return 'Turn 10'; }
		if (lDist >= 2575 && lDist <= 2690) { return 'Hairpin'; }
		if (lDist >= 2790 && lDist <= 3355) { return '200R'; }
		if (lDist >= 3465 && lDist <= 3820) { return 'Spoon'; }
		if (lDist >= 3910 && lDist <= 4580) { return 'Crossover'; }
		if (lDist >= 4610 && lDist <= 4890) { return '130R'; }
		if (lDist >= 5030 && lDist <= 5460) { return 'Casio Triangle'; }

		// Suzuka East Course
	} else if (layoutId === 2012) {
		if (lDist >= 1895 || lDist <= 60) { return 'Start-Finish'; }
		if (lDist >= 345 && lDist <= 630) { return 'First'; }
		if (lDist >= 760 && lDist <= 1155) { return 'S'; }
		if (lDist >= 1170 && lDist <= 1350) { return 'Gyaku Bank'; }
		if (lDist >= 1390 && lDist <= 1545) { return 'Dunlop'; }
		if (lDist >= 1555 && lDist <= 1870) { return 'Turn 8'; }

		// Suzuka West Course
	} else if (layoutId === 2013) {
		if (lDist >= 3385 || lDist <= 185) { return 'Start-Finish'; }
		if (lDist >= 435 && lDist <= 715) { return '130R'; }
		if (lDist >= 855 && lDist <= 915) { return 'Turn 2'; }
		if (lDist >= 945 && lDist <= 995) { return 'Turn 3'; }
		if (lDist >= 1250 && lDist <= 1315) { return 'Degner'; }
		if (lDist >= 1405 && lDist <= 1490) { return 'Turn 5'; }
		if (lDist >= 1710 && lDist <= 1810) { return 'Turn 6'; }
		if (lDist >= 1855 && lDist <= 1965) { return 'Hairpin'; }
		if (lDist >= 2065 && lDist <= 2640) { return '200R'; }
		if (lDist >= 2740 && lDist <= 3100) { return 'Spoon'; }

		// Twin Ring Motegi Road Course
	} else if (layoutId === 6658) {
		if (lDist >= 4460 || lDist <= 20) { return 'Start-Finish'; }
		if (lDist >= 210 && lDist <= 310) { return 'First Corner'; }
		if (lDist >= 311 && lDist <= 410) { return 'Second Corner'; }
		if (lDist >= 890 && lDist <= 1010) { return 'Third Corner'; }
		if (lDist >= 1011 && lDist <= 1150) { return 'Fourth Corner'; }
		if (lDist >= 1600 && lDist <= 1700) { return 'Firth Corner'; }
		if (lDist >= 1850 && lDist <= 2015) { return '130 Radius'; }
		if (lDist >= 2205 && lDist <= 2510) { return 'S Curve'; }
		if (lDist >= 2660 && lDist <= 2780) { return 'V Corner'; }
		if (lDist >= 3100 && lDist <= 3230) { return 'Hairpin Curve'; }
		if (lDist >= 3231 && lDist <= 3945) { return 'Down Hill Straight'; }
		if (lDist >= 3946 && lDist <= 4030) { return '90 Degrees Corner'; }
		if (lDist >= 4430 && lDist <= 4420) { return 'Victory Corner'; }

		// Twin Ring Motegi West Course
	} else if (layoutId === 7026) {
		if (lDist >= 1185 || lDist <= 55) { return 'Start-Finish'; }
		if (lDist >= 210 && lDist <= 310) { return 'First Corner'; }
		if (lDist >= 311 && lDist <= 410) { return 'Second Corner'; }
		if (lDist >= 850 && lDist <= 1045) { return 'West Short Cut'; }
		if (lDist >= 1046 && lDist <= 1140) { return 'Victory Corner'; }

		// Twin Ring Motegi East Course
	} else if (layoutId === 7027) {
		if (lDist >= 3170 || lDist <= 20) { return 'Start-Finish'; }
		if (lDist >= 21 && lDist <= 500) { return 'Down Hill Straight'; }
		if (lDist >= 501 && lDist <= 605) { return '90 Degrees Corner'; }
		if (lDist >= 695 && lDist <= 985) { return 'East Short Cut'; }
		if (lDist >= 986 && lDist <= 1100) { return 'Fourth Corner'; }
		if (lDist >= 1535 && lDist <= 1640) { return 'Fifth Corner'; }
		if (lDist >= 1785 && lDist <= 1970) { return '130 Radius'; }
		if (lDist >= 2140 && lDist <= 2455) { return 'S Curve'; }
		if (lDist >= 2600 && lDist <= 2725) { return 'V Corner'; }
		if (lDist >= 3045 && lDist <= 3169) { return 'Hairpin Curve'; }

		// Valerbanen Full Circuit
	} else if (layoutId === 9465) {
		if (lDist >= 2110 || lDist <= 125) { return 'Start-Finish'; }
		if (lDist >= 126 && lDist <= 171) { return 'Turn 1'; }
		if (lDist >= 172 && lDist <= 230) { return 'Turn 2'; }
		if (lDist >= 297 && lDist <= 390) { return 'Turn 3'; }
		if (lDist >= 391 && lDist <= 548) { return 'Turn 4'; }
		if (lDist >= 750 && lDist <= 842) { return 'Turn 5'; }
		if (lDist >= 878 && lDist <= 1007) { return 'Turn 6'; }
		if (lDist >= 1437 && lDist <= 1500) { return 'Turn 7'; }
		if (lDist >= 1520 && lDist <= 1620) { return 'Turn 8'; }
		if (lDist >= 1805 && lDist <= 1925) { return 'Turn 9'; }
		if (lDist >= 2020 && lDist <= 2109) { return 'Turn 10'; }

		// Watkins Glen International Short Inner Loop
	} else if (layoutId === 9177) {
		if (lDist >= 3634 || lDist <= 205) { return 'Start-Finish'; }
		if (lDist >= 295 && lDist <= 435) { return 'The Ninety'; }
		if (lDist >= 610 && lDist <= 1060) { return 'The Esses'; }
		if (lDist >= 1105 && lDist <= 1380) { return 'Turn 4'; }
		if (lDist >= 1381 && lDist <= 1888) { return 'Backstretch'; }
		if (lDist >= 1889 && lDist <= 2128) { return 'Bus Stop (Inner Loop)'; }
		if (lDist >= 2153 && lDist <= 2543) { return 'The Outer Loop'; }
		if (lDist >= 3128 && lDist <= 3293) { return 'Turn 10'; }
		if (lDist >= 3438 && lDist <= 3633) { return 'Turn 11'; }

		// Watkins Glen International Grand Prix Inner Loop
	} else if (layoutId === 9324) {
		if (lDist >= 5164 || lDist <= 205) { return 'Start-Finish'; }
		if (lDist >= 295 && lDist <= 435) { return 'The Ninety'; }
		if (lDist >= 610 && lDist <= 1060) { return 'The Esses'; }
		if (lDist >= 1105 && lDist <= 1380) { return 'Turn 4'; }
		if (lDist >= 1381 && lDist <= 1888) { return 'Backstretch'; }
		if (lDist >= 1889 && lDist <= 2128) { return 'Bus Stop (Inner Loop)'; }
		if (lDist >= 2153 && lDist <= 2508) { return 'Outer Loop'; }
		if (lDist >= 2688 && lDist <= 2938) { return 'Laces'; }
		if (lDist >= 3193 && lDist <= 3453) { return 'Toe'; }
		if (lDist >= 3454 && lDist <= 3933) { return 'The Boot'; }
		if (lDist >= 3934 && lDist <= 4113) { return 'Heel'; }
		if (lDist >= 4248 && lDist <= 4438) { return 'Turn 13'; }
		if (lDist >= 4658 && lDist <= 4823) { return 'Turn 14'; }
		if (lDist >= 4968 && lDist <= 5163) { return 'Turn 15'; }

		// Watkins Glen International Short Circuit
	} else if (layoutId === 9343) {
		if (lDist >= 3626 || lDist <= 205) { return 'Start-Finish'; }
		if (lDist >= 295 && lDist <= 435) { return 'The Ninety'; }
		if (lDist >= 610 && lDist <= 1060) { return 'The Esses'; }
		if (lDist >= 1105 && lDist <= 1380) { return 'Turn 4'; }
		if (lDist >= 1381 && lDist <= 1888) { return 'Backstretch'; }
		if (lDist >= 2145 && lDist <= 2535) { return 'The Outer Loop'; }
		if (lDist >= 3120 && lDist <= 3285) { return 'Turn 10'; }
		if (lDist >= 3430 && lDist <= 3625) { return 'Turn 11'; }

		// Watkins Glen International Grand Prix
	} else if (layoutId === 9344) {
		if (lDist >= 5156 || lDist <= 205) { return 'Start-Finish'; }
		if (lDist >= 295 && lDist <= 435) { return 'The Ninety'; }
		if (lDist >= 610 && lDist <= 1060) { return 'The Esses'; }
		if (lDist >= 1105 && lDist <= 1380) { return 'Turn 4'; }
		if (lDist >= 1381 && lDist <= 1888) { return 'Backstretch'; }
		if (lDist >= 2145 && lDist <= 2500) { return 'The Outer Loop'; }
		if (lDist >= 2680 && lDist <= 2930) { return 'Laces'; }
		if (lDist >= 3185 && lDist <= 3445) { return 'Toe'; }
		if (lDist >= 3446 && lDist <= 3925) { return 'The Boot'; }
		if (lDist >= 3926 && lDist <= 4105) { return 'Heel'; }
		if (lDist >= 4240 && lDist <= 4430) { return 'Turn 9'; }
		if (lDist >= 4650 && lDist <= 4815) { return 'Turn 10'; }
		if (lDist >= 4960 && lDist <= 5155) { return 'Turn 11'; }

		// WeatherTech Raceway Laguna Seca
	} else if (layoutId === 1856) {
		if (lDist >= 3390 || lDist <= 100) { return 'Start-Finish'; }
		if (lDist >= 160 && lDist <= 300) { return 'Turn 1'; }
		if (lDist >= 400 && lDist <= 600) { return 'Andretti Hairpin'; }
		if (lDist >= 730 && lDist <= 860) { return 'Turn 3'; }
		if (lDist >= 995 && lDist <= 1140) { return 'Turn 4'; }
		if (lDist >= 1200 && lDist <= 1360) { return 'Turn 5'; }
		if (lDist >= 1460 && lDist <= 1690) { return 'Turn 6'; }
		if (lDist >= 1890 && lDist <= 2110) { return 'Turn 7'; }
		if (lDist >= 2111 && lDist <= 2340) { return 'Rahal Straight'; }
		if (lDist >= 2410 && lDist <= 2590) { return 'The Corkscrew'; }
		if (lDist >= 2600 && lDist <= 2820) { return 'Turn 10'; }
		if (lDist >= 2935 && lDist <= 3070) { return 'Turn 11'; }
		if (lDist >= 3220 && lDist <= 3340) { return 'Turn 12'; }

		// Zhejiang Grand Prix
	} else if (layoutId === 8075) {
		if (lDist >= 3011 || lDist <= 220) { return 'Start-Finish'; }
		if (lDist >= 250 && lDist <= 340) { return 'Turn 1'; }
		if (lDist >= 341 && lDist <= 400) { return 'Turn 2'; }
		if (lDist >= 401 && lDist <= 555) { return 'Turn 3'; }
		if (lDist >= 556 && lDist <= 710) { return 'Turn 4'; }
		if (lDist >= 711 && lDist <= 830) { return 'Turn 5'; }
		if (lDist >= 831 && lDist <= 1015) { return 'Turn 6'; }
		if (lDist >= 1115 && lDist <= 1205) { return 'Turn 7'; }
		if (lDist >= 1206 && lDist <= 1345) { return 'Turn 8'; }
		if (lDist >= 1346 && lDist <= 1450) { return 'Turn 9'; }
		if (lDist >= 1560 && lDist <= 1632) { return 'Turn 10'; }
		if (lDist >= 1633 && lDist <= 1696) { return 'Turn 11'; }
		if (lDist >= 1697 && lDist <= 1780) { return 'Turn 12'; }
		if (lDist >= 1930 && lDist <= 2050) { return 'Turn 13'; }
		if (lDist >= 2135 && lDist <= 2260) { return 'Turn 14'; }
		if (lDist >= 2380 && lDist <= 2530) { return 'Turn 15'; }
		if (lDist >= 2880 && lDist <= 3010) { return 'Turn 16'; }

		// Zhejiang East Circuit
	} else if (layoutId === 8327) {
		if (lDist >= 3266 || lDist <= 149) { return 'Start-Finish'; }
		if (lDist >= 150 && lDist <= 260) { return 'Turn 1'; }
		if (lDist >= 345 && lDist <= 440) { return 'Turn 2'; }
		if (lDist >= 505 && lDist <= 604) { return 'Turn 3'; }
		if (lDist >= 605 && lDist <= 760) { return 'Turn 4'; }
		if (lDist >= 1020 && lDist <= 1084) { return 'Turn 5'; }
		if (lDist >= 1085 && lDist <= 1275) { return 'Turn 6'; }
		if (lDist >= 1310 && lDist <= 1375) { return 'Turn 7'; }
		if (lDist >= 1376 && lDist <= 1470) { return 'Turn 8'; }

		// Zhuhai GP
	} else if (layoutId === 3464) {
		if (lDist >= 4115 || lDist <= 55) { return 'Start-Finish'; }
		if (lDist >= 390 && lDist <= 475) { return 'Turn 1'; }
		if (lDist >= 476 && lDist <= 560) { return 'Turn 2'; }
		if (lDist >= 790 && lDist <= 890) { return 'Turn 3'; }
		if (lDist >= 1095 && lDist <= 1170) { return 'Turn 4'; }
		if (lDist >= 1171 && lDist <= 1245) { return 'Turn 5'; }
		if (lDist >= 1435 && lDist <= 1585) { return 'Turn 6'; }
		if (lDist >= 1750 && lDist <= 1850) { return 'Turn 7'; }
		if (lDist >= 2080 && lDist <= 2210) { return 'Turn 8'; }
		if (lDist >= 2390 && lDist <= 2490) { return 'Turn 9'; }
		if (lDist >= 2575 && lDist <= 2680) { return 'Turn 10'; }
		if (lDist >= 3130 && lDist <= 3240) { return 'Turn 11'; }
		if (lDist >= 3241 && lDist <= 3320) { return 'Turn 12'; }
		if (lDist >= 3600 && lDist <= 3755) { return 'Turn 13'; }
		if (lDist >= 3840 && lDist <= 3970) { return 'Turn 14'; }

		// AVUUS 1998
	} else if (layoutId === 12420) {
		if (lDist >= 2314 || lDist <= 100) { return 'Start-Finish'; }
		if (lDist >= 700 && lDist <= 900) { return 'Südkurve'; }
		if (lDist >= 1160 && lDist <= 1355) { return 'Chicane'; }
		if (lDist >= 1535 && lDist <= 1750) { return 'Turn 2'; }
		if (lDist >= 1760 && lDist <= 1890) { return 'Chicane'; }
		if (lDist >= 1891 && lDist <= 2313) { return 'Turn 3'; }

		// AVUUS 1994
	} else if (layoutId === 12500) {
		if (lDist >= 2359 || lDist <= 100) { return 'Start-Finish'; }
		if (lDist >= 700 && lDist <= 900) { return 'Südkurve'; }
		if (lDist >= 1160 && lDist <= 1355) { return 'Chicane'; }
		if (lDist >= 1535 && lDist <= 1750) { return 'Turn 2'; }
		if (lDist >= 1840 && lDist <= 2358) { return 'Turn 3'; }

		// Alemanenring Full Circuit
	} else if (layoutId === 12938) {
		if (lDist >= 2325 || lDist <= 168) { return 'Start-Finish'; }
		if (lDist >= 168 && lDist <= 300) { return 'Turn 1'; }
		if (lDist >= 500 && lDist <= 620) { return 'Turn 2'; }
		if (lDist >= 621 && lDist <= 790) { return 'Turn 3'; }
		if (lDist >= 1030 && lDist <= 1150) { return 'Turn 4'; }
		if (lDist >= 1300 && lDist <= 1450) { return 'Turn 5'; }
		if (lDist >= 1830 && lDist <= 1950) { return 'Chicane'; }
		if (lDist >= 2050 && lDist <= 2150) { return 'Turn 6'; }
		if (lDist >= 2200 && lDist <= 2320) { return 'Hairpin'; }

		// Donington Park Grand Prix
	} else if (layoutId === 10394) {
		if (lDist >= 3806 || lDist <= 0) { return 'Start-Finish'; }
		if (lDist >= 3 && lDist <= 190) { return 'Wheatcroft Straight'; }
		if (lDist >= 195 && lDist <= 438) { return 'Redgate'; }
		if (lDist >= 600 && lDist <= 807) { return 'Hollywood'; }
		if (lDist >= 820 && lDist <= 950) { return 'Craner Curves'; }
		if (lDist >= 1050 && lDist <= 1170) { return 'Old Hairpin'; }
		if (lDist >= 1250 && lDist <= 1400) { return 'Starkeys Bridge'; }
		if (lDist >= 1530 && lDist <= 1630) { return 'Schwantz Curve'; }
		if (lDist >= 1680 && lDist <= 1820) { return 'McLeans'; }
		if (lDist >= 1980 && lDist <= 2300) { return 'Coppice'; }
		if (lDist >= 2310 && lDist <= 2700) { return 'Dunlop Straight'; }
		if (lDist >= 2750 && lDist <= 2940) { return "Fogarty's Esses"; }
		if (lDist >= 3260 && lDist <= 3400) { return 'Melbourne Hairpin'; }
		if (lDist >= 3650 && lDist <= 3750) { return 'Goddards'; }

		// Donington Park National
	} else if (layoutId === 10725) {
		if (lDist >= 3005 || lDist <= 0) { return "Start-Finish"; }
		if (lDist >= 0 && lDist <= 190) { return "Wheatcroft Straight"; }
		if (lDist >= 191 && lDist <= 495) { return "Redgate"; }
		if (lDist >= 496 && lDist <= 807) { return "Hollywood"; }
		if (lDist >= 808 && lDist <= 1009) { return "Craner Curves"; }
		if (lDist >= 1010 && lDist <= 1226) { return "Old Hairpin"; }						
		if (lDist >= 1227 && lDist <= 1450) { return "Starkeys Bridge"; }
		if (lDist >= 1451 && lDist <= 1642) { return "Schwantz Curve"; }
		if (lDist >= 1643 && lDist <= 1867) { return "McLeans"; }
		if (lDist >= 1973 && lDist <= 2300) { return "Coppice"; }
		if (lDist >= 2301 && lDist <= 2709) { return "Dunlop Straight"; }
		if (lDist >= 2710 && lDist <= 2926) { return "Fogarty's Esses"; }

		// Circuit de Pau-Ville Grand Prix
	} else if (layoutId === 11905) {
		if (lDist >= 2744 || lDist <= 78) { return "Start-Finish"; }
		if (lDist >= 90 && lDist <= 260) { return "Turn 1"; }
		if (lDist >= 290 && lDist <= 460) { return "La Gare"; }
		if (lDist >= 470 && lDist <= 800) { return "Avenue Leon Say"; }
		if (lDist >= 820 && lDist <= 950) { return "Pont Oscar"; }
		if (lDist >= 980 && lDist <= 1100) { return "Lycée"; }						
		if (lDist >= 1121 && lDist <= 1400) { return "Cassino"; }
		if (lDist >= 1421 && lDist <= 1704) { return "Parc Beaumont"; }
		if (lDist >= 1725 && lDist <= 1817) { return "Foch"; }
		if (lDist >= 1838 && lDist <= 1900) { return "Av. Gen. Poeymiraum"; }
		if (lDist >= 1960 && lDist <= 2070) { return "Buisson"; }
		if (lDist >= 2156 && lDist <= 2270) { return "Chicane"; }
		if (lDist >= 2287 && lDist <= 2735) { return "Av. Gaston Lacoste"; }

		// Interlagos Grand Prix
	} else if (layoutId === 10463) {
		if (lDist >= 4000 || lDist <= 150) { return "Start-Finish"; }
		if (lDist >= 250 && lDist <= 500) { return "Senna S"; }
		if (lDist >= 510 && lDist <= 730) { return "Curva do Sol"; }
		if (lDist >= 1260 && lDist <= 1400) { return "Turn 4"; }
		if (lDist >= 1490 && lDist <= 1620) { return "Turn 5"; }
		if (lDist >= 1910 && lDist <= 2030) { return "Ferradura"; }
		if (lDist >= 2070 && lDist <= 2140) { return "Laranjinha"; }
		if (lDist >= 2240 && lDist <= 2325) { return "Turn 8"; }
		if (lDist >= 2360 && lDist <= 2498) { return "Pinheirinho"; }
		if (lDist >= 2660 && lDist <= 2760) { return "Bico de Pato"; }
		if (lDist >= 2860 && lDist <= 3040) { return "Mergulho"; }
		if (lDist >= 3130 && lDist <= 3240) { return "Junção"; }
		if (lDist >= 3290 && lDist <= 3350) { return "Turn 13"; }
		if (lDist >= 3580 && lDist <= 3710) { return "Turn 14"; }

		// Circuit de Charade Grand Prix
	} else if (layoutId === 10904) {
		if (lDist >= 3738 || lDist <= 10) { return "Start-Finish"; }
		if (lDist >= 70 && lDist <= 240) { return "Turn 1"; }
		if (lDist >= 440 && lDist <= 545) { return "Virage de Manson"; }
		if (lDist >= 665 && lDist <= 655) { return "Turn 3"; }
		if (lDist >= 716 && lDist <= 730) { return "Turn 4"; }
		if (lDist >= 885 && lDist <= 915) { return "Turn 5"; }
		if (lDist >= 976 && lDist <= 1011) { return "Turn 6"; }
		if (lDist >= 1072 && lDist <= 1069) { return "Puy de Charade"; }
		if (lDist >= 1130 && lDist <= 1150) { return "Turn 7"; }
		if (lDist >= 1211 && lDist <= 1288) { return "Turn 8"; }
		if (lDist >= 1680 && lDist <= 1820) { return "Épingle de Champeaux"; }
		if (lDist >= 1910 && lDist <= 1930) { return "Turn 10"; }
		if (lDist >= 1991 && lDist <= 2047) { return "Turn 11"; }
		if (lDist >= 2623 && lDist <= 2740) { return "Virage du Petit Pont"; }
		if (lDist >= 2871 && lDist <= 2977) { return "Epingle Marlboro"; }
		if (lDist >= 3140 && lDist <= 3190) { return "S de Thèdes"; }
		if (lDist >= 3251 && lDist <= 3407) { return "Turn 15"; }
		if (lDist >= 3468 && lDist <= 3500) { return "Turn 16"; }
		if (lDist >= 3630 && lDist <= 3707) { return "Virage Rosier"; }

		// Circuit de Charade Classic Racing School
	} else if (layoutId === 11908) {
		if (lDist >= 3738 || lDist <= 10) { return "Start-Finish"; }
		if (lDist >= 70 && lDist <= 240) { return "Turn 1"; }
		if (lDist >= 440 && lDist <= 545) { return "Virage de Manson"; }
		if (lDist >= 665 && lDist <= 655) { return "Turn 3"; }
		if (lDist >= 716 && lDist <= 730) { return "Turn 4"; }
		if (lDist >= 885 && lDist <= 915) { return "Turn 5"; }
		if (lDist >= 976 && lDist <= 1011) { return "Turn 6"; }
		if (lDist >= 1072 && lDist <= 1069) { return "Puy de Charade"; }
		if (lDist >= 1130 && lDist <= 1150) { return "Turn 7"; }
		if (lDist >= 1211 && lDist <= 1288) { return "Turn 8"; }
		if (lDist >= 1680 && lDist <= 1820) { return "Épingle de Champeaux"; }
		if (lDist >= 1910 && lDist <= 1930) { return "Turn 10"; }
		if (lDist >= 1991 && lDist <= 2047) { return "Turn 11"; }
		if (lDist >= 2623 && lDist <= 2740) { return "Virage du Petit Pont"; }
		if (lDist >= 2871 && lDist <= 2977) { return "Epingle Marlboro"; }
		if (lDist >= 3140 && lDist <= 3190) { return "S de Thèdes"; }
		if (lDist >= 3251 && lDist <= 3407) { return "Turn 15"; }
		if (lDist >= 3468 && lDist <= 3500) { return "Turn 16"; }
		if (lDist >= 3630 && lDist <= 3707) { return "Virage Rosier"; }

		// Circuit Zandvoort Grand Prix
	} else if (layoutId === 10782) {
        if (lDist >= 3946 || lDist <= 140) { return "Start-Finish"; }
        if (lDist >= 201 && lDist <= 457) { return "Tarzanbocht"; }
        if (lDist >= 617 && lDist <= 649) { return "Gerlachbocht"; }
        if (lDist >= 710 && lDist <= 891) { return "Hundenholtzbocht"; }
        if (lDist >= 1023 && lDist <= 1219) { return "Hunserug"; }
        if (lDist >= 1280 && lDist <= 1410) { return "Stotemakerbocht"; }
        if (lDist >= 1471 && lDist <= 1815) { return "Scheiviak"; }
        if (lDist >= 1900 && lDist <= 2030) { return "Masterbocht"; }
        if (lDist >= 2091 && lDist <= 2270) { return "Wllgenhaegebocht"; }
        if (lDist >= 2377 && lDist <= 2555) { return "Bocht 8"; }
        if (lDist >= 2980 && lDist <= 3170) { return "S-Bocht"; }
        if (lDist >= 3374 && lDist <= 3512) { return "Kumhobocht"; }
        if (lDist >= 3573 && lDist <= 3915) { return "Arie Luyendijkbocht"; }

		// Circuit Zandvoort Short
	} else if (layoutId === 11090) {
        if (lDist >= 2536 || lDist <= 140) { return "Start-Finish"; }
        if (lDist >= 201 && lDist <= 457) { return "Tarzanbocht"; }
        if (lDist >= 617 && lDist <= 649) { return "Gerlachbocht"; }
        if (lDist >= 710 && lDist <= 891) { return "Hundenholtzbocht"; }
        if (lDist >= 1148 && lDist <= 1166) { return "Hunserug"; }
        if (lDist >= 1226 && lDist <= 1316) { return "Hairpin"; }
        if (lDist >= 1580 && lDist <= 1790) { return "S-Bocht"; }
        if (lDist >= 1978 && lDist <= 2094) { return "Kumhobocht"; }
        if (lDist >= 2155 && lDist <= 2505) { return "Arie Luyendijkbocht"; }

		// DEKRA Lausitzring GP Course Oval T1
	} else if (layoutId === 10328) {
        if (lDist >= 4365 || lDist <= 0) { return "Start-Finish"; }
        if (lDist >= 373 && lDist <= 970) { return "Turn 1"; }
        if (lDist >= 1560 && lDist <= 1648) { return "Turn 2"; }
        if (lDist >= 1709 && lDist <= 1779) { return "Turn 3"; }
        if (lDist >= 1840 && lDist <= 2076) { return "Turn 4"; }
        if (lDist >= 2550 && lDist <= 2947) { return "Turn 5"; }
        if (lDist >= 3349 && lDist <= 3491) { return "Turn 6"; }
        if (lDist >= 3552 && lDist <= 3703) { return "Turn 7"; }
        if (lDist >= 3764 && lDist <= 3857) { return "Turn 8"; }
        if (lDist >= 3918 && lDist <= 3992) { return "Turn 9"; }
        if (lDist >= 4053 && lDist <= 4335) { return "Turn 10"; }

		// Estoril Circuit Grand Prix
	} else if (layoutId === 2024) {
        if (lDist >= 3700 || lDist <= 290) { return "Start-Finish"; }
        if (lDist >= 351 && lDist <= 531) { return "Turn 1"; }
        if (lDist >= 650 && lDist <= 755) { return "Turn 2"; }
        if (lDist >= 854 && lDist <= 1036) { return "Lamy"; }
        if (lDist >= 1097 && lDist <= 1290) { return "Curva Vip"; }
        if (lDist >= 1463 && lDist <= 1645) { return "Turn 5"; }
        if (lDist >= 1894 && lDist <= 2226) { return "Parabolica Interna"; }
        if (lDist >= 2430 && lDist <= 2606) { return "Orelha"; }
        if (lDist >= 2667 && lDist <= 2745) { return "Turn 8"; }
        if (lDist >= 2806 && lDist <= 2850) { return "Gancho"; }
        if (lDist >= 2911 && lDist <= 2970) { return "Turn 10"; }
        if (lDist >= 3031 && lDist <= 3070) { return "Turn 11"; }
        if (lDist >= 3131 && lDist <= 3248) { return "Esses"; }
        if (lDist >= 3309 && lDist <= 3669) { return "Parabólica Ayrton Senna"; }

		// Estoril Circuit Tanque
	} else if (layoutId === 12318) {
        if (lDist >= 3674 || lDist <= 290) { return "Start-Finish"; }
        if (lDist >= 351 && lDist <= 531) { return "Turn 1"; }
        if (lDist >= 650 && lDist <= 755) { return "Turn 2"; }
        if (lDist >= 854 && lDist <= 1036) { return "Lamy"; }
        if (lDist >= 1097 && lDist <= 1290) { return "Curva Vip"; }
        if (lDist >= 1463 && lDist <= 1645) { return "Turn 5"; }
        if (lDist >= 1894 && lDist <= 2226) { return "Parabólica Interna"; }
        if (lDist >= 2430 && lDist <= 2606) { return "Orelha"; }
        if (lDist >= 2767 && lDist <= 2933) { return "Tanque"; }
        if (lDist >= 3072 && lDist <= 3198) { return "Esses"; }
        if (lDist >= 3029 && lDist <= 3643) { return "Parabólica Ayrton Senna"; }

		// Fliegerhorst Diepholz Full Circuit
	} else if (layoutId === 12395) {
        if (lDist >= 2565 || lDist <= 0) { return "Start-Finish"; }
        if (lDist >= 330 && lDist <= 670) { return "Turn 1"; }
        if (lDist >= 1118 && lDist <= 1260) { return "Chicane 1"; }
        if (lDist >= 1385 && lDist <= 1475) { return "Chicane 2"; }
        if (lDist >= 1790 && lDist <= 1987) { return "Turn 2"; }
        if (lDist >= 2156 && lDist <= 2217) { return "Chicane 3"; }
        if (lDist >= 2477 && lDist <= 2535) { return "Chicane 4"; }

		// Hockenheimring Classic Grand Prix
	} else if (layoutId === 12112) {
        if (lDist >= 6566 || lDist <= 0) { return "Start-Finish"; }
        if (lDist >= 238 && lDist <= 385) { return "Nord Kurve"; }
        if (lDist >= 1899 && lDist <= 2134) { return "Jim Clark"; }
        if (lDist >= 3162 && lDist <= 3359) { return "Ost"; }
        if (lDist >= 4544 && lDist <= 4722) { return "Ayrton Senna"; }
        if (lDist >= 5567 && lDist <= 5727) { return "Agip"; }
        if (lDist >= 5940 && lDist <= 6078) { return "Sachs"; }
        if (lDist >= 6139 && lDist <= 6245) { return "Turn 14"; }
        if (lDist >= 6306 && lDist <= 6391) { return "Turn 15"; }
        if (lDist >= 6452 && lDist <= 6536) { return "Opel"; }

		// Hockenheimring Classic Short
	} else if (layoutId === 12236) {
        if (lDist >= 2403 || lDist <= 0) { return "Start-Finish"; }
        if (lDist >= 238 && lDist <= 385) { return "Nord Kurve"; }
        if (lDist >= 581 && lDist <= 659) { return "Turn 2"; }
        if (lDist >= 720 && lDist <= 874) { return "Turn 3"; }
        if (lDist >= 1055 && lDist <= 1167) { return "Turn 4"; }
        if (lDist >= 1228 && lDist <= 1370) { return "Turn 5"; }
        if (lDist >= 1431 && lDist <= 1556) { return "Agip"; }
        if (lDist >= 1770 && lDist <= 1902) { return "Sachs"; }
        if (lDist >= 1963 && lDist <= 2079) { return "Turn 6"; }
        if (lDist >= 2140 && lDist <= 2223) { return "Turn 7"; }
        if (lDist >= 2284 && lDist <= 2373) { return "Opel"; }

	// The End
	}
	return '';
}

export function getTrackName(trackId: number) {
	if (trackDetails[trackId] !== undefined) {
		return trackDetails[trackId].Name;
	}
	return '';
}

export function getLayoutName(trackId: number, layoutId: number) {
	if (trackDetails[trackId] !== undefined && trackDetails[trackId].Layouts[layoutId] !== undefined) {
		return trackDetails[trackId].Layouts[layoutId].Name;
	}
	return '';
}

export default function getPitEntrance(trackId: number, layoutId: number) {
	if (trackDetails[trackId] !== undefined && trackDetails[trackId].Layouts[layoutId] !== undefined) {
		return trackDetails[trackId].Layouts[layoutId].BoxEntrance;
	}
	return -1;
}
