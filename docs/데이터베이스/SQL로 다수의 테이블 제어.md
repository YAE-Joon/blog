***
## 01. 데이터 그룹 짓기

```sql
	SELECT user_id, COUNT(*) //검색할 column의 count
	FROM rental //테이블
	GROUP BY user_id // 그룹의 기준 컬럼
```
- limit, order by, group by 는 문법상 항상 맨 마지막에 온다.
- SQL 기본 에서 사용한 SUM, AVG, MAX , MIN 을 함께 활용하여 사용 한다.
```sql
		SELECT user_id, SUM(Coulmn) //검색할 column의 count
		FROM rental //테이블
		GROUP BY user_id // 그룹의 기준 컬럼
```
		   
```sql
		SELECT user_id, AVG(Coulmn) //검색할 column의 count
		FROM rental //테이블
		GROUP BY user_id // 그룹의 기준 컬럼
```
***
## 02. 데이터 그룹에 조건 적용하기

   - 조건을 붙여 데이터를 그룹화하기 위해서는 HAVING 조건을 사용하게 됨.
```SQL
	   SELECT user_id, COUNT(*)
	   FROM rental 
	   GROUP BY user_id
	
	   HAVING COUNT(user_id)>1; //조건, use_id를 count 를 할 때 2개 이상인 데이터만 검색
```
***
## 03. 두 개의 테이블에서 조회하기
  
  - 관계형 데이터베이스에서 COULMN이 같이 공유하고 있는 경우 이 두 테이블을 엮어서 조회할 수 있다. 이 때 INNER JOIN 이라는 명령어를 사용. JOIN 이란 여러개의 테이블을 서로 연결하는 명령어이다.
  - INNER JOIN
```MySQL
		  SELECT * //검색할 컬럼 (전체를 조회)
		  FROM rental 
		  INNER JOIN user; // 연결할 테이블
```
- 조건을 적용하기(ON)
```SQL
		  SELECT * //검색할 컬럼 (전체를 조회)
		  FROM rental 
		  INNER JOIN user //연결할 테이블
		  ON user.id = rental.user_id; // 연결한 조건 컬럼	 여기서 user.id 는 user
										 table의 id Column 을 말하고,
										 rental.user_id 는 rental table의 user_id 
										 COULUM을 말하며 이 둘이 같은 것만 연결하라는 의미
```  
- LEFT JOIN : 두 테이블을 연결할 때, 한 쪽 테이블에 데이터가 없는 정보도 NULL값으로 함께 출력
```SQL
		SELECT * //검색할 컬럼 (전체를 조회)
		  FROM user 
		  LEFT JOIN user //연결할 테이블, NULL 값을 포함하여 데이터 출력
		  ON user.id = rental.user_id; // 연결한 조건 컬럼, 중심이 되는 테이블은 user 
										  TABLE이다. 중심이 되는 TABLE 은 FROM 에서 명
										  시하고 있다. 이때 모든 user테이블의 id COLUMN
										  이 rental TABLE의 user_id COLUMN 과 겹치
										  게 되는 것이다.
```
- RIGHT JOIN :  중심이 되는 테이블을 FROM 으로 놓고,	이 때 연결할 테이블의 NULL값을 포함한 데이터를   출력하고 싶을 때, RIGHT JOIN 명령어를 이용. 
```SQL
		SELECT * //검색할 컬럼 (전체를 조회)
		  FROM user 
		  RIGHT JOIN user //연결할 테이블, NULL 값을 포함하여 데이터 출력
		  ON user.id = rental.user_id; // 연결한 조건 컬럼, 중심이 되는 테이블은 user 
										  TABLE이다. 중심이 되는 TABLE 은 FROM 에서 명
										  시하고 있다. 이때 모든 user테이블의 id COLUMN
										  이 rental TABLE의 user_id COLUMN 과 겹치
										  게 되는 것이다.
```
![SQL로 다수의 테이블 제어-20250117222948181.webp](images%2FSQL%EB%A1%9C%20%EB%8B%A4%EC%88%98%EC%9D%98%20%ED%85%8C%EC%9D%B4%EB%B8%94%20%EC%A0%9C%EC%96%B4-20250117222948181.webp)
