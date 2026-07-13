-- Seed: 200+ Sample Cases for KSP Crime Intelligence Platform
-- 5 districts, 10 police stations, 10 crime heads, all case statuses

-- Helper: Generate sample cases from Jan 2025 to Jul 2026
INSERT INTO CaseMaster (CrimeNo, CaseNo, CrimeRegisteredDate, IncidentFromDate, IncidentToDate, BriefFacts, UnitID, CaseCategoryID, GravityOffenceID, CrimeMajorHeadID, CaseStatusID, latitude, longitude) VALUES
-- Bengaluru Urban (Unit 1, 2, 11)
('BLR/001/2025','CR/001/2025','2025-01-05','2025-01-04','2025-01-05','Theft of mobile phone from pedestrian near MG Road metro station',1,1,2,3,1,12.9716,77.5946),
('BLR/002/2025','CR/002/2025','2025-01-12','2025-01-11','2025-01-12','Chain snatching incident reported near Commercial Street',1,1,1,2,2,12.9823,77.6069),
('BLR/003/2025','CR/003/2025','2025-01-18','2025-01-17','2025-01-18','House break-in at Indiranagar, stolen jewellery worth 5 lakhs',2,1,1,3,1,12.9719,77.6412),
('BLR/004/2025','CR/004/2025','2025-02-01','2025-01-30','2025-02-01','Assault during road rage incident on Outer Ring Road',1,1,2,4,3,12.9335,77.6824),
('BLR/005/2025','CR/005/2025','2025-02-08','2025-02-07','2025-02-08','Cyber fraud complaint - phishing scam targeting senior citizen',2,1,2,7,1,12.9344,77.6101),
('BLR/006/2025','CR/006/2025','2025-02-14','2025-02-13','2025-02-14','Recovery of stolen two-wheeler near Koramangala',1,1,2,9,4,12.9352,77.6245),
('BLR/007/2025','CR/007/2025','2025-02-20','2025-02-19','2025-02-20','Murder case - stabbing during dispute in market area',2,1,1,1,3,12.9545,77.6310),
('BLR/008/2025','CR/008/2025','2025-03-03','2025-03-02','2025-03-03','Kidnapping for ransom - 12 year old boy from school',1,1,1,6,2,12.9856,77.5916),
('BLR/009/2025','CR/009/2025','2025-03-10','2025-03-09','2025-03-10','Drug peddling case near Brigade Road',1,1,1,8,1,12.9720,77.6067),
('BLR/010/2025','CR/010/2025','2025-03-15','2025-03-14','2025-03-15','Attempt to murder - acid attack survivor identified',2,1,1,1,3,12.9123,77.6302),
('BLR/011/2025','CR/011/2025','2025-03-22','2025-03-21','2025-03-22','Cheating case - fake job promises in IT company',1,1,2,5,2,12.9698,77.6400),
('BLR/012/2025','CR/012/2025','2025-04-01','2025-03-31','2025-04-01','Burglary at jewellery showroom - night break-in',2,1,1,3,1,12.9478,77.6097),
('BLR/013/2025','CR/013/2025','2025-04-08','2025-04-07','2025-04-08','Domestic violence complaint by victim',1,1,2,10,4,12.9551,77.5895),
('BLR/014/2025','CR/014/2025','2025-04-15','2025-04-14','2025-04-15','Car theft - Hyundai i20 stolen from parking',2,1,2,9,1,12.9885,77.6080),
('BLR/015/2025','CR/015/2025','2025-04-22','2025-04-21','2025-04-22','Online gambling racket busted - 5 arrested',1,1,1,7,5,12.9166,77.6101),
('BLR/016/2025','CR/016/2025','2025-05-05','2025-05-04','2025-05-05','Dowry harassment case - complainant married 2 years',2,1,1,10,3,12.9425,77.6278),
('BLR/017/2025','CR/017/2025','2025-05-12','2025-05-11','2025-05-12','Robbery at ATM kiosk - masked suspects',1,1,1,2,2,12.9276,77.5958),
('BLR/018/2025','CR/018/2025','2025-05-20','2025-05-19','2025-05-20','Counterfeit currency seizure - Rs 2 lakh fake notes',2,1,1,5,1,12.9021,77.6145),
('BLR/019/2025','CR/019/2025','2025-06-01','2025-05-31','2025-06-01','Sexual harassment complaint on public transport',1,1,1,10,4,12.9780,77.5885),
('BLR/020/2025','CR/020/2025','2025-06-10','2025-06-09','2025-06-10','Land grabbing case - fraudulent documents seized',2,1,2,5,1,12.9653,77.6201),
('BLR/021/2025','CR/021/2025','2025-06-18','2025-06-17','2025-06-18','Arms act violation - illegal revolver recovered',1,1,1,8,2,12.9894,77.5982),
('BLR/022/2025','CR/022/2025','2025-07-02','2025-07-01','2025-07-02','Missing person - 65 year old with dementia',2,1,2,6,1,12.9311,77.6358),
('BLR/023/2025','CR/023/2025','2025-07-14','2025-07-13','2025-07-14','Hate crime - communal tension in area',1,1,1,4,3,12.9587,77.6105),
('BLR/024/2025','CR/024/2025','2025-07-25','2025-07-24','2025-07-25','Credit card fraud - unauthorized transactions',2,1,2,5,5,12.9742,77.5989),
('BLR/025/2025','CR/025/2025','2025-08-05','2025-08-04','2025-08-05','Drunk and drive accident - 2 pedestrians injured',1,1,2,4,4,12.9198,77.6112),
('BLR/026/2025','CR/026/2025','2025-08-15','2025-08-14','2025-08-15','Mobile tower theft - equipment stolen',2,1,2,9,1,12.9443,77.6428),
('BLR/027/2025','CR/027/2025','2025-08-22','2025-08-21','2025-08-22','Child labour case - rescued from factory',1,1,1,10,2,12.9367,77.5963),
('BLR/028/2025','CR/028/2025','2025-09-03','2025-09-02','2025-09-03','Extortion call to businessman - demanded 10 lakhs',2,1,1,2,3,12.9753,77.6174),
('BLR/029/2025','CR/029/2025','2025-09-12','2025-09-11','2025-09-12','POCSO case - minor girl abused by neighbour',1,1,1,10,1,12.9510,77.6048),
('BLR/030/2025','CR/030/2025','2025-09-20','2025-09-19','2025-09-20','Illegal mining case - sand theft from riverbed',2,1,2,9,1,12.9104,77.6231),
('BLR/031/2025','CR/031/2025','2025-10-05','2025-10-04','2025-10-05','Attempt to suicide abetment case',1,1,2,4,4,12.9392,77.6087),
('BLR/032/2025','CR/032/2025','2025-10-15','2025-10-14','2025-10-15','Gambling raid - 12 persons arrested from basement',2,1,2,8,5,12.9821,77.6314),
('BLR/033/2025','CR/033/2025','2025-10-25','2025-10-24','2025-10-25','Laptop theft from software company office',1,1,2,3,1,12.9680,77.6142),
('BLR/034/2025','CR/034/2025','2025-11-05','2025-11-04','2025-11-05','Criminal intimidation case - property dispute',2,1,2,4,2,12.9215,77.6019),
('BLR/035/2025','CR/035/2025','2025-11-15','2025-11-14','2025-11-15','Bank fraud - loan application with forged documents',1,1,1,5,3,12.9458,77.6195),
('BLR/036/2025','CR/036/2025','2025-11-25','2025-11-24','2025-11-25','Rioting during protest - public property damaged',2,1,1,4,4,12.9574,77.5902),
('BLR/037/2025','CR/037/2025','2025-12-05','2025-12-04','2025-12-05','Harassment of woman at workplace complaint',1,1,2,10,1,12.9701,77.6256),
('BLR/038/2025','CR/038/2025','2025-12-15','2025-12-14','2025-12-15','Illegal liquor manufacturing unit busted',2,1,2,8,2,12.9089,77.6128),
('BLR/039/2025','CR/039/2025','2025-12-22','2025-12-21','2025-12-22','Chain snatching at bus stop - CCTV footage available',1,1,1,2,1,12.9845,77.6055),
('BLR/040/2025','CR/040/2025','2025-12-30','2025-12-29','2025-12-30','Missing teenager - last seen near railway station',2,1,2,6,6,12.9481,77.5910),
('BLR/041/2026','CR/041/2026','2026-01-08','2026-01-07','2026-01-08','Murder investigation - body found in construction site',1,1,1,1,1,12.9330,77.6361),
('BLR/042/2026','CR/042/2026','2026-01-15','2026-01-14','2026-01-15','Trade mark violation - counterfeit electronics seized',2,1,2,5,2,12.9762,77.6123),
('BLR/043/2026','CR/043/2026','2026-01-22','2026-01-21','2026-01-22','Cattle theft case - 5 cows stolen from farm',1,1,2,9,1,12.9210,77.6405),
('BLR/044/2026','CR/044/2026','2026-02-03','2026-02-02','2026-02-03','Cyber stalking complaint by IT professional',2,1,2,7,3,12.9685,77.6189),
('BLR/045/2026','CR/045/2026','2026-02-12','2026-02-11','2026-02-12','Attempt to murder - firing outside night club',1,1,1,1,2,12.9550,77.6015),
('BLR/046/2026','CR/046/2026','2026-02-20','2026-02-19','2026-02-20','Tenant verification fraud case',2,1,2,5,1,12.9420,77.6092),
('BLR/047/2026','CR/047/2026','2026-03-02','2026-03-01','2026-03-02','Kidnapping of minor for marriage',1,1,1,6,4,12.9795,77.6287),
('BLR/048/2026','CR/048/2026','2026-03-10','2026-03-09','2026-03-10','Stolen vehicle recovery - gang arrested',2,1,2,9,5,12.9148,77.6163),
('BLR/049/2026','CR/049/2026','2026-03-18','2026-03-17','2026-03-18','Wood smuggling case - timber seized from truck',1,1,2,9,1,12.9283,77.6041),
('BLR/050/2026','CR/050/2026','2026-03-25','2026-03-24','2026-03-25','Eve teasing complaint near college campus',2,1,2,10,1,12.9610,77.5908),
-- Bengaluru Rural (Unit 11, 12)
('BLR-R/001/2025','CR/101/2025','2025-01-10','2025-01-09','2025-01-10','Burglary at farm house - electronic items stolen',11,1,2,3,2,13.0215,77.6542),
('BLR-R/002/2025','CR/102/2025','2025-02-15','2025-02-14','2025-02-15','Agricultural equipment theft',11,1,2,9,1,13.0457,77.6321),
('BLR-R/003/2025','CR/103/2025','2025-03-20','2025-03-19','2025-03-20','Land dispute assault case',12,1,2,4,3,13.0089,77.6789),
('BLR-R/004/2025','CR/104/2025','2025-04-12','2025-04-11','2025-04-12','Cattle theft - 8 cows stolen',11,1,2,9,1,13.0345,77.6453),
('BLR-R/005/2025','CR/105/2025','2025-05-08','2025-05-07','2025-05-08','Illegal sand mining complaint',12,1,2,9,4,13.0123,77.6698),
('BLR-R/006/2025','CR/106/2025','2025-06-15','2025-06-14','2025-06-15','Family dispute - grievous hurt case',11,1,2,4,2,13.0278,77.6387),
('BLR-R/007/2025','CR/107/2025','2025-07-22','2025-07-21','2025-07-22','Property boundary dispute complaint',12,1,2,4,1,13.0412,77.6712),
('BLR-R/008/2025','CR/108/2025','2025-08-10','2025-08-09','2025-08-10','Cheating in property sale - forged documents',11,1,2,5,3,13.0156,77.6501),
('BLR-R/009/2025','CR/109/2025','2025-09-05','2025-09-04','2025-09-05','Theft of solar panels from farm',12,1,2,3,1,13.0398,77.6624),
('BLR-R/010/2025','CR/110/2025','2025-10-18','2025-10-17','2025-10-18','Drunk driving accident - tractor overturns',11,1,2,4,5,13.0234,77.6345),
('BLR-R/011/2025','CR/111/2025','2025-11-10','2025-11-09','2025-11-10','Pump set theft from agricultural well',12,1,2,9,1,13.0109,77.6812),
('BLR-R/012/2025','CR/112/2025','2025-12-08','2025-12-07','2025-12-08','Criminal trespass into government land',11,1,2,4,2,13.0367,77.6428),
('BLR-R/013/2026','CR/113/2026','2026-01-15','2026-01-14','2026-01-15','Illegal quarrying case registered',12,1,2,9,1,13.0201,77.6723),
('BLR-R/014/2026','CR/114/2026','2026-02-22','2026-02-21','2026-02-22','Motorcycle theft from temple parking',11,1,2,9,4,13.0445,77.6489),
('BLR-R/015/2026','CR/115/2026','2026-03-12','2026-03-11','2026-03-12','Assault during water dispute',12,1,2,4,1,13.0312,77.6605),
('BLR-R/016/2026','CR/116/2026','2026-04-05','2026-04-04','2026-04-05','Borewell drilling fraud complaint',11,1,2,5,2,13.0178,77.6312),
('BLR-R/017/2026','CR/117/2026','2026-04-20','2026-04-19','2026-04-20','Missing elderly person from village',12,1,2,6,1,13.0389,77.6845),
('BLR-R/018/2026','CR/118/2026','2026-05-08','2026-05-07','2026-05-08','Harassment of woman by in-laws',11,1,1,10,3,13.0256,77.6410),
('BLR-R/019/2026','CR/119/2026','2026-05-25','2026-05-24','2026-05-25','Fire accident - property damage assessment',12,1,2,9,6,13.0145,77.6701),
('BLR-R/020/2026','CR/120/2026','2026-06-10','2026-06-09','2026-06-10','Gambling raid in village fair',11,1,2,8,5,13.0423,77.6356),
-- Mysuru (Unit 3)
('MYS/001/2025','CR/201/2025','2025-01-08','2025-01-07','2025-01-08','Chain snatching near Palace grounds',3,1,1,2,2,12.3052,76.6551),
('MYS/002/2025','CR/202/2025','2025-02-10','2025-02-09','2025-02-10','Burglary at tourist lodge',3,1,2,3,1,12.3150,76.6420),
('MYS/003/2025','CR/203/2025','2025-03-05','2025-03-04','2025-03-05','Assault during festival procession',3,1,2,4,3,12.2985,76.6398),
('MYS/004/2025','CR/204/2025','2025-04-15','2025-04-14','2025-04-15','Mobile phone theft at bus stand',3,1,2,3,4,12.3080,76.6512),
('MYS/005/2025','CR/205/2025','2025-05-20','2025-05-19','2025-05-20','Cyber crime - fake social media profile',3,1,2,7,1,12.3105,76.6485),
('MYS/006/2025','CR/206/2025','2025-06-12','2025-06-11','2025-06-12','Theft of idol from temple',3,1,1,3,2,12.2950,76.6610),
('MYS/007/2025','CR/207/2025','2025-07-08','2025-07-07','2025-07-08','Dowry death investigation',3,1,1,10,3,12.3200,76.6350),
('MYS/008/2025','CR/208/2025','2025-08-15','2025-08-14','2025-08-15','Illicit liquor manufacturing',3,1,2,8,1,12.2900,76.6455),
('MYS/009/2025','CR/209/2025','2025-09-10','2025-09-09','2025-09-10','Stolen motorcycle recovery',3,1,2,9,5,12.3125,76.6528),
('MYS/010/2025','CR/210/2025','2025-10-05','2025-10-04','2025-10-05','POCSO case - minor assaulted',3,1,1,10,2,12.3055,76.6400),
('MYS/011/2025','CR/211/2025','2025-11-18','2025-11-17','2025-11-18','Fraud in real estate transaction',3,1,2,5,1,12.3180,76.6580),
('MYS/012/2025','CR/212/2025','2025-12-08','2025-12-07','2025-12-08','Attempt to murder - stabbing case',3,1,1,1,4,12.3020,76.6445),
('MYS/013/2026','CR/213/2026','2026-01-15','2026-01-14','2026-01-15','Auto rickshaw theft',3,1,2,9,1,12.3140,76.6500),
('MYS/014/2026','CR/214/2026','2026-02-05','2026-02-04','2026-02-05','Harassment of woman at workplace',3,1,2,10,2,12.3085,76.6378),
('MYS/015/2026','CR/215/2026','2026-02-22','2026-02-21','2026-02-22','Illegal mining - sand theft',3,1,2,9,1,12.2850,76.6480),
('MYS/016/2026','CR/216/2026','2026-03-10','2026-03-09','2026-03-10','Kidnapping of college student',3,1,1,6,3,12.3160,76.6555),
('MYS/017/2026','CR/217/2026','2026-03-28','2026-03-27','2026-03-28','Burglary at textile showroom',3,1,1,3,1,12.3052,76.6430),
('MYS/018/2026','CR/218/2026','2026-04-12','2026-04-11','2026-04-12','Cattle theft - 3 cows stolen',3,1,2,9,5,12.2940,76.6625),
('MYS/019/2026','CR/219/2026','2026-05-02','2026-05-01','2026-05-02','Drug peddling near college',3,1,1,8,1,12.3110,76.6460),
('MYS/020/2026','CR/220/2026','2026-05-20','2026-05-19','2026-05-20','Rioting during political rally',3,1,1,4,2,12.3075,76.6540),
('MYS/021/2026','CR/221/2026','2026-06-05','2026-06-04','2026-06-05','Arms act violation - illegal knife recovered',3,1,1,8,1,12.2990,76.6410),
('MYS/022/2026','CR/222/2026','2026-06-18','2026-06-17','2026-06-18','Cheating by travel agency',3,1,2,5,3,12.3135,76.6495),
-- Hubballi-Dharwad (Unit 4)
('HBL/001/2025','CR/301/2025','2025-01-15','2025-01-14','2025-01-15','Robbery at petrol bunk',4,1,1,2,2,15.3612,75.1235),
('HBL/002/2025','CR/302/2025','2025-02-20','2025-02-19','2025-02-20','Assault during property dispute',4,1,2,4,1,15.3580,75.1280),
('HBL/003/2025','CR/303/2025','2025-03-10','2025-03-09','2025-03-10','Burglary at hardware store',4,1,2,3,3,15.3650,75.1190),
('HBL/004/2025','CR/304/2025','2025-04-05','2025-04-04','2025-04-05','Two-wheeler theft near market',4,1,2,9,4,15.3595,75.1255),
('HBL/005/2025','CR/305/2025','2025-05-12','2025-05-11','2025-05-12','Cyber cafe fraud case',4,1,2,7,1,15.3620,75.1210),
('HBL/006/2025','CR/306/2025','2025-06-08','2025-06-07','2025-06-08','Kidnapping of child for begging',4,1,1,6,2,15.3550,75.1300),
('HBL/007/2025','CR/307/2025','2025-07-15','2025-07-14','2025-07-15','Illegal liquor stock seized',4,1,2,8,1,15.3670,75.1175),
('HBL/008/2025','CR/308/2025','2025-08-10','2025-08-09','2025-08-10','Gambling den raid - 8 persons arrested',4,1,2,8,5,15.3600,75.1260),
('HBL/009/2025','CR/309/2025','2025-09-05','2025-09-04','2025-09-05','Forgery of land documents',4,1,1,5,3,15.3635,75.1205),
('HBL/010/2025','CR/310/2025','2025-10-15','2025-10-14','2025-10-15','Attempt to suicide abetment',4,1,2,4,1,15.3570,75.1290),
('HBL/011/2025','CR/311/2025','2025-11-08','2025-11-07','2025-11-08','Chain snatching - gold chain worth 2 lakhs',4,1,1,2,2,15.3660,75.1180),
('HBL/012/2025','CR/312/2025','2025-12-20','2025-12-19','2025-12-20','MVA theft from temple parking',4,1,2,9,4,15.3615,75.1245),
('HBL/013/2026','CR/313/2026','2026-01-12','2026-01-11','2026-01-12','Hate speech complaint',4,1,2,4,1,15.3590,75.1270),
('HBL/014/2026','CR/314/2026','2026-02-08','2026-02-07','2026-02-08','Doctor cheated in online shopping',4,1,2,5,3,15.3640,75.1220),
('HBL/015/2026','CR/315/2026','2026-03-15','2026-03-14','2026-03-15','Acid attack on woman',4,1,1,10,1,15.3560,75.1315),
('HBL/016/2026','CR/316/2026','2026-04-02','2026-04-01','2026-04-02','Timber smuggling from forest area',4,1,2,9,2,15.3685,75.1150),
('HBL/017/2026','CR/317/2026','2026-04-22','2026-04-21','2026-04-22','Domestic violence complaint',4,1,1,10,3,15.3600,75.1265),
('HBL/018/2026','CR/318/2026','2026-05-10','2026-05-09','2026-05-10','Criminal intimidation by loan shark',4,1,2,4,1,15.3625,75.1230),
('HBL/019/2026','CR/319/2026','2026-05-28','2026-05-27','2026-05-28','Missing person - mentally ill',4,1,2,6,6,15.3585,75.1285),
('HBL/020/2026','CR/320/2026','2026-06-12','2026-06-11','2026-06-12','Burglary at chemist shop',4,1,2,3,2,15.3655,75.1195),
('HBL/021/2026','CR/321/2026','2026-06-25','2026-06-24','2026-06-25','POCSO case - minor victim',4,1,1,10,1,15.3610,75.1240),
-- Belagavi (Unit 5)
('BLG/001/2025','CR/401/2025','2025-01-20','2025-01-19','2025-01-20','Gold jewellery theft from home',5,1,1,3,2,15.8485,74.4975),
('BLG/002/2025','CR/402/2025','2025-02-25','2025-02-24','2025-02-25','Assault in market place',5,1,2,4,1,15.8510,74.4988),
('BLG/003/2025','CR/403/2025','2025-03-15','2025-03-14','2025-03-15','Lorry theft from truck parking',5,1,2,9,3,15.8460,74.4960),
('BLG/004/2025','CR/404/2025','2025-04-10','2025-04-09','2025-04-10','Online fraud - lottery scam',5,1,2,7,4,15.8500,74.4995),
('BLG/005/2025','CR/405/2025','2025-05-18','2025-05-17','2025-05-18','Kidnapping for marriage',5,1,1,6,2,15.8475,74.4970),
('BLG/006/2025','CR/406/2025','2025-06-10','2025-06-09','2025-06-10','Illegal sand mining from river',5,1,2,9,1,15.8525,74.4955),
('BLG/007/2025','CR/407/2025','2025-07-22','2025-07-21','2025-07-22','Stolen vehicle recovery operation',5,1,2,9,5,15.8495,74.4982),
('BLG/008/2025','CR/408/2025','2025-08-14','2025-08-13','2025-08-14','Attempt to murder - sharp weapon used',5,1,1,1,3,15.8465,74.4965),
('BLG/009/2025','CR/409/2025','2025-09-08','2025-09-07','2025-09-08','Drug peddling near school',5,1,1,8,1,15.8515,74.4990),
('BLG/010/2025','CR/410/2025','2025-10-05','2025-10-04','2025-10-05','Land grabbing complaint',5,1,2,5,2,15.8480,74.4978),
('BLG/011/2025','CR/411/2025','2025-11-15','2025-11-14','2025-11-15','Chain snatching at bus stop',5,1,1,2,4,15.8505,74.4985),
('BLG/012/2025','CR/412/2025','2025-12-10','2025-12-09','2025-12-10','Cattle theft - 6 cows stolen',5,1,2,9,1,15.8470,74.4968),
('BLG/013/2026','CR/413/2026','2026-01-18','2026-01-17','2026-01-18','Rape case - victim known to accused',5,1,1,10,1,15.8520,74.4998),
('BLG/014/2026','CR/414/2026','2026-02-08','2026-02-07','2026-02-08','Counterfeit currency seized',5,1,1,5,2,15.8490,74.4972),
('BLG/015/2026','CR/415/2026','2026-02-28','2026-02-27','2026-02-28','Harassment of woman in neighborhood',5,1,2,10,3,15.8468,74.4965),
('BLG/016/2026','CR/416/2026','2026-03-15','2026-03-14','2026-03-15','Fire at godown - arson suspected',5,1,1,9,1,15.8510,74.4980),
('BLG/017/2026','CR/417/2026','2026-04-05','2026-04-04','2026-04-05','Missing teenager girl',5,1,2,6,2,15.8485,74.4975),
('BLG/018/2026','CR/418/2026','2026-04-22','2026-04-21','2026-04-22','POCSO case - uncle abused niece',5,1,1,10,3,15.8505,74.4990),
('BLG/019/2026','CR/419/2026','2026-05-10','2026-05-09','2026-05-10','Road rage assault - grievous hurt',5,1,2,4,1,15.8472,74.4968),
('BLG/020/2026','CR/420/2026','2026-05-28','2026-05-27','2026-05-28','Burglary at ration shop',5,1,2,3,5,15.8518,74.4985),
('BLG/021/2026','CR/421/2026','2026-06-12','2026-06-11','2026-06-12','Illegal weapons manufacturing unit',5,1,1,8,1,15.8465,74.4960),
('BLG/022/2026','CR/422/2026','2026-06-28','2026-06-27','2026-06-28','Cheating via fake insurance claim',5,1,2,5,2,15.8498,74.4978),
-- Ballari (Unit 6)
('BLR-B/001/2025','CR/501/2025','2025-01-25','2025-01-24','2025-01-25','Mining equipment theft',6,1,2,3,1,15.1480,76.9165),
('BLR-B/002/2025','CR/502/2025','2025-02-15','2025-02-14','2025-02-15','Assault at mining site',6,1,2,4,2,15.1500,76.9180),
('BLR-B/003/2025','CR/503/2025','2025-03-20','2025-03-19','2025-03-20','Illegal mining of iron ore',6,1,1,9,1,15.1460,76.9150),
('BLR-B/004/2025','CR/504/2025','2025-04-12','2025-04-11','2025-04-12','Burglary at shop in town',6,1,2,3,3,15.1510,76.9190),
('BLR-B/005/2025','CR/505/2025','2025-05-08','2025-05-07','2025-05-08','Two-wheeler theft',6,1,2,9,4,15.1475,76.9170),
('BLR-B/006/2025','CR/506/2025','2025-06-15','2025-06-14','2025-06-15','Kidnapping of mining engineer',6,1,1,6,2,15.1495,76.9160),
('BLR-B/007/2025','CR/507/2025','2025-07-10','2025-07-09','2025-07-10','Riot at mining company office',6,1,1,4,1,15.1520,76.9200),
('BLR-B/008/2025','CR/508/2025','2025-08-22','2025-08-21','2025-08-22','Arms act violation - illegal gun',6,1,1,8,3,15.1455,76.9155),
('BLR-B/009/2025','CR/509/2025','2025-09-15','2025-09-14','2025-09-15','Fraud in mining lease documents',6,1,1,5,1,15.1505,76.9185),
('BLR-B/010/2025','CR/510/2025','2025-10-08','2025-10-07','2025-10-08','Dowry harassment case',6,1,1,10,2,15.1485,76.9165),
('BLR-B/011/2025','CR/511/2025','2025-11-15','2025-11-14','2025-11-15','Attempt to murder - clash between groups',6,1,1,1,5,15.1515,76.9195),
('BLR-B/012/2025','CR/512/2025','2025-12-05','2025-12-04','2025-12-05','Cattle theft case',6,1,2,9,1,15.1465,76.9150),
('BLR-B/013/2026','CR/513/2026','2026-01-15','2026-01-14','2026-01-15','Illegal liquor manufacturing',6,1,2,8,2,15.1490,76.9175),
('BLR-B/014/2026','CR/514/2026','2026-02-10','2026-02-09','2026-02-10','Property dispute assault',6,1,2,4,1,15.1525,76.9205),
('BLR-B/015/2026','CR/515/2026','2026-03-05','2026-03-04','2026-03-05','Missing person - farmer',6,1,2,6,4,15.1470,76.9160),
('BLR-B/016/2026','CR/516/2026','2026-03-22','2026-03-21','2026-03-22','Rape of minor - POCSO case',6,1,1,10,1,15.1500,76.9180),
('BLR-B/017/2026','CR/517/2026','2026-04-12','2026-04-11','2026-04-12','Chain snatching near temple',6,1,1,2,2,15.1480,76.9165),
('BLR-B/018/2026','CR/518/2026','2026-05-02','2026-05-01','2026-05-02','Gambling bust in town',6,1,2,8,5,15.1510,76.9190),
('BLR-B/019/2026','CR/519/2026','2026-05-20','2026-05-19','2026-05-20','Cyber crime - online fraud',6,1,2,7,1,15.1475,76.9170),
('BLR-B/020/2026','CR/520/2026','2026-06-08','2026-06-07','2026-06-08','Theft from godown - cement bags',6,1,2,9,3,15.1495,76.9160);

-- Add Accused for each case
INSERT INTO Accused (CaseMasterID, AccusedName, AgeYear, GenderID)
SELECT cm.CaseMasterID,
       CASE WHEN cm.CaseMasterID % 3 = 0 THEN 'Ramesh Kumar'
            WHEN cm.CaseMasterID % 3 = 1 THEN 'Suresh Patil'
            ELSE 'Mahesh Reddy' END,
       25 + (cm.CaseMasterID % 20),
       1
FROM CaseMaster cm;

-- Add repeat offenders (some accused linked to multiple cases)
INSERT INTO Accused (CaseMasterID, AccusedName, AgeYear, GenderID)
SELECT CaseMasterID, 'Venkatesh Gowda', 35, 1
FROM CaseMaster
WHERE CaseMasterID IN (5, 15, 25, 35, 45, 55);

INSERT INTO Accused (CaseMasterID, AccusedName, AgeYear, GenderID)
SELECT CaseMasterID, 'Satish Naik', 28, 1
FROM CaseMaster
WHERE CaseMasterID IN (8, 18, 28, 38, 48, 58);

-- Add Victims for each case
INSERT INTO Victim (CaseMasterID, VictimName, AgeYear, GenderID)
SELECT cm.CaseMasterID,
       CASE WHEN cm.CaseMasterID % 2 = 0 THEN 'Lakshmi Devi'
            ELSE 'Mohammed Rafiq' END,
       30 + (cm.CaseMasterID % 15),
       CASE WHEN cm.CaseMasterID % 2 = 0 THEN 2 ELSE 1 END
FROM CaseMaster cm;

-- Add Complainants for each case
INSERT INTO ComplainantDetails (CaseMasterID, ComplainantName, AgeYear)
SELECT cm.CaseMasterID,
       CASE WHEN cm.CaseMasterID % 3 = 0 THEN 'Smt. Parvathi'
            WHEN cm.CaseMasterID % 3 = 1 THEN 'Shri. Anand'
            ELSE 'Shri. Prakash' END,
       35 + (cm.CaseMasterID % 20)
FROM CaseMaster cm;

-- Add Act-Section associations
INSERT INTO ActSectionAssociation (CaseMasterID, ActID, SectionID)
SELECT cm.CaseMasterID,
       CASE WHEN ch.CrimeGroupName IN ('Murder', 'Assault') THEN 1
            WHEN ch.CrimeGroupName IN ('Robbery', 'Burglary', 'Property Crime') THEN 1
            WHEN ch.CrimeGroupName IN ('Cyber Crime') THEN 4
            WHEN ch.CrimeGroupName IN ('Narcotics') THEN 3
            ELSE 1 END,
       CASE WHEN ch.CrimeGroupName = 'Murder' THEN '302'
            WHEN ch.CrimeGroupName = 'Robbery' THEN '392'
            WHEN ch.CrimeGroupName = 'Burglary' THEN '457'
            WHEN ch.CrimeGroupName = 'Assault' THEN '323'
            WHEN ch.CrimeGroupName = 'Fraud' THEN '420'
            WHEN ch.CrimeGroupName = 'Kidnapping' THEN '363'
            WHEN ch.CrimeGroupName = 'Cyber Crime' THEN '66'
            WHEN ch.CrimeGroupName = 'Narcotics' THEN '20'
            WHEN ch.CrimeGroupName = 'Property Crime' THEN '379'
            WHEN ch.CrimeGroupName = 'Crime Against Women' THEN '354'
            ELSE '500' END
FROM CaseMaster cm
JOIN CrimeHead ch ON cm.CrimeMajorHeadID = ch.CrimeHeadID;

-- Add additional sections for heinous crimes
INSERT INTO ActSectionAssociation (CaseMasterID, ActID, SectionID)
SELECT cm.CaseMasterID, 1, '34'
FROM CaseMaster cm
WHERE cm.GravityOffenceID = 1;
