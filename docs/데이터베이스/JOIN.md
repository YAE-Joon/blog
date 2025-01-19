***
## 01. JOIN

- 두 개 이상의 테이블들을 연결 또는 결합하여 데이터를 출력하는 것 (집합연산자의 INTERSECT 와는 다른 개념)
- 연산자에 따라 JOIN의 방식을 분류할 수 있다.
	- EQUI JOIN(등가 교집합) : 두 테이블 간에 서로 정확하게 일치하는 경우 활용하는 조인, 등가 연산자를 사용한 조인을 의미 (`=` ). 대부분 기본키 -외래키 관계를 기반으로 발생하지만 모든 조인이 그렇지는 않다.
	- Non EQUI JOIN(비등가 교집합) : 두 테이블 간에 서로 정확하게 일치하지 않는 경우 활용하는 조인, 등가 연산자 이외의 연산자들을 사용한 조인을 의미한다.(`>`,`>=`,`<`,`<=`,`BETWEEN`)
	- ex) 
```SQL
SELECT e.ename, e.salary, s.grade FROM emp e, salary_table s WHERE e.salary BETWEEN s.min_salary AND s.max_salary;
```
  ***
## 02. INNER JOIN

- 내부 JOIN이라고 하며, JOIN조건에서 동일한 값이 있는 행만 반환, JOIN의 기본값으로 INNER는 생략이 가능하다.
- ex) 
```SQL
SELECT * FROM table1 [INNER]JOIN table2 ON table1.column명 = table2.column명; 
```
  - JOIN의 조건을 `ON` 구를 사용해 지정한다.
  ***
## 03. USING

  - 같은 이름을 가진 칼럼들 중 원하는 칼럼에 대해서만 선택적으로 등가 조인 가능(SQL sever에서는 지원X)
  - 굳이 ON 을 사용해 동일한 컬럼명을 두번 작성하지 않고, USING을 사용하여 간편하게 사용
```SQL
SELECT * FROM table1 [INNER]JOIN table2 USING (column명); 
```
***
## 04. NATURAL JOIN

  - 두 테이블 간의 동일한 이름을 같는 모든 칼럼들에 대해 등가 조인을 실행 
  - ON이나 USING 조건절 은 정의할 수 없다. 조건 자체를 생략한다.
  - 동일한 이름을 갖는 컬럼이 예상하지 못하게 사용할 수 있기 때문에 , 실무에서 많이 사용하지는 않는다.
```SQL
SELECT * FROM table1 NATURAL JOIN table2; 
```
***

## 05. CROSS JOIN

- JOIN 조건이 없는 경우 생길 수 있는 모든 데이터의 조합을 조회 : JOIN 처럼 공유되는 컬럼이 존재하지 않아  두 테이블에서 생길 수 있는 모든 데이터를 연결한다.
```SQL
SELECT * FROM PERSON (CROSS) JOIN PUBLIC_TRANSPORT;
```
- (CROSS) JOIN 도 INNER JOIN처럼 생략이 가능하다. JOIN 뒤에 ON이 오지 않기 때문에 구별이 가능하다.
***
## 06. OUTER JOIN
- 두 개의 테이블 간에 교집합을 조회하고, 한쪽 테이블에 있는 데이터도 포함시켜서 조회한다. 
- 빈 곳의 경우 NULL값으로 출력
- WHERE 조건절에서 한쪽에만 있는 데이터를 포함시킬 테이블 반대쪽으로(+)를 위치한다.(oracle DB 문법)
```SQL
SELECT * FROM USER, CLASS WHERE USER.CLASS_ID = CLASS.CLASS_ID(+);
```
위와 같은 경우 USER테이블은 모든 값이 출력, class 테이블의 경우 비워져있는 값은 null로 출력 
- LEFT JOIN ( 표준 OUTER JOIN)
```SQL
SELECT * FROM USER LEFT(OUTER)JOIN CLASS ON USER.CLASS_ID = CLASS.CLASS_ID;
```
동일한 결과 값이 나옴
- RIGHT JOIN(표준 OUTER JOIN)
```SQL
SELECT * FROM USER RIGHT(OUTER)JOIN CLASS ON USER.CLASS_ID = CLASS.CLASS_ID;
```
- 위와 같은 경우는 RIGHT JOIN이기 때문에, CLASS 값이 모두 조회가 된다.
- FULL OUTER JOIN(표준 OUTER JOIN)
```SQL
SELECT * FROM USER FULL OUTER JOIN CLASS ON USER.CLASS_ID = CLASS.CLASS_ID;
```
합집합과 마찬가지로 모든 데이터가 JOIN되어 출력한다.
```SQL
SELECT * FROM USER LEFT(OUTER)JOIN CLASS ON USER.CLASS_ID = CLASS.CLASS_ID;
UNION
SELECT * FROM USER RIGHT(OUTER)JOIN CLASS ON USER.CLASS_ID = CLASS.CLASS_ID;
```
- LEFT OUTER와 RIGHT OUTER를 함께 UNION했을 때 FULL OUTER와 동일한결과가 나오게 된다.
***
## 07. SELF JOIN
- 동일 테이블 사이의 조인
- 테이블과 칼럼 이름이 모두 동일하기 때문에 식별을 위해 별칭을 필수로 해준다.

```SQL
SELECT ALPHA.컬럼, BETA.컬럼 FROM 테이블1 ALPHA, 테이블2 BETA WHERE ALPHA.컬럼명2 = BETA.컬럼명1;
```
- ex) 계층형 질의에서 사용이 가능하다. 차상위 계층을 표시하고 싶을때.