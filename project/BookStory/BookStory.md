---
title: "BookStory"
description: "BookStory 프로젝트 정리"
tag: ["BookStory"]
sidebar_position: 2
---

## BookStory
### 도서 쇼핑 시스템
***
## 📝 프로젝트 개요

- 프로젝트명: 온라인 도서 쇼핑몰
- 개발 기간: 2024/3 ~ 2024/4
- 담당 역할:
  - ERD 설계
  - 카테고리 시스템 설계 및 구현
- 개발 환경: Spring Boot, JPA, Java
- 목표: 계층형 카테고리 시스템을 통한 효율적인 도서 분류 및 관리
- **GitHub:** [**🔗 Repository**](https://github.com/YAE-Joon/bookstory)

*** 

## 🛠 기술 스택

#### Backend

- Language & Framework: Spring Boot 
- ORM: JPA, QueryDSL 
- Security: Spring Security, OAuth2, JWT
- Database: MySQL

#### 개발 도구

- IDE: IntelliJ IDEA Ultimate
- API Documentation: Swagger (SpringDoc)
- Build Tool: Gradle
- Version Control: GitLab
- Test: JUnit 5, Spring Boot Test

***
## 💡 주요 구현 기능

#### 1. 계층형 카테고리 구조 설계
```java
@Entity
public class Category extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent")
    private List<Category> child = new ArrayList<>();
    
    private Integer level;
}
```
- 상위-하위 관계를 가진 다중 깊이의 카테고리 구조 구현
- JPA의 자기참조 엔티티를 활용한 카테고리 계층 구조 설계
- 카테고리 레벨별 조회 및 관리 기능 구현

#### 2. 도서-카테고리 다대다 관계 구현
```java
@Entity
public class BookCategory {
@ManyToOne
@JoinColumn(name = "category_id")
Category category;

    @ManyToOne
    @JoinColumn(name = "book_id")
    Book book;
}
```

- 도서와 카테고리 간의 다대다 관계를 중간 테이블로 설계
- 한 도서의 복수 카테고리 분류 지원 (BookCategory)

#### 3. RESTful API 엔드포인트 구현
```java
@RestController
@RequestMapping("/api")
public class CategoryController {
    @GetMapping("/v1/bookCategory")
    public List<RequestCategory> categories() {  }
    
    @GetMapping("/v1/bookCategory/lowRank/{id}")
    public List<RequestCategory> categories(@PathVariable Long id) {  }
    
    @PostMapping("/v1/bookCategory/add")
    public ResponseBookCategory addCategory(@RequestBody ResponseBookCategoryList list) {  }
}
```
- 카테고리  CRUD 기능의 RESTful API 구현
- RESTful 원칙을 준수한 API 설계
- 계층별 카테고리 관리 API 구현
***
## 🎯 성과

- 계층형 카테고리 구조를 통한 체계적인 도서 분류 시스템 구축
- JPA를 활용한 효율적인 데이터 접근 및 관리
- 확장 가능한 카테고리 시스템 설계로 향후 기능 추가 용이

## 💪 문제 해결

#### 1. 카테고리 계층 구조 설계 문제

- 문제: 깊이가 있는 카테고리 구조의 효율적인 설계 필요
- 해결: JPA의 자기참조 관계를 활용하여 유연한 계층 구조 구현
- 결과: 확장 가능한 카테고리 시스템 구축


#### 2. 다대다 관계 매핑 최적화

- 문제: 도서와 카테고리 간의 복잡한 관계 매핑 필요
- 해결: 중간 테이블을 활용한 명확한 관계 설정
- 결과: 효율적인 데이터 관리 및 조회 성능 향상
***
## 🌱 프로젝트를 통해 배운 점

- 계층형 데이터 구조 설계 및 구현 경험
- JPA를 활용한 복잡한 엔티티 관계 매핑 실무 적용
- RESTful API 설계 원칙 적용과 실무 구현 경험
