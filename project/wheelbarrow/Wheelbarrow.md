---
title: "Wheelbarrow"
description: "FastAPI 기반 업무 관리 시스템"
tag: ["FastAPI", "SQLAlchemy", "Python", "MVC"]
sidebar_position: 1
---

## Wheelbarrow
### FastAPI 기반 개인 업무 관리 시스템
***
## 📝 프로젝트 개요

- 프로젝트명: Wheelbarrow (개인 업무 관리 시스템)
- 개발 기간: 2024.06 ~ 진행중
- 인원 구성: 개인 프로젝트
- 담당 역할: 풀스택 개발 (FastAPI 백엔드 구현)
- 개발 환경: FastAPI, SQLAlchemy, Python 3.7+
- 목표: MVC 아키텍처를 적용한 확장 가능한 업무 관리 시스템 구축
- **GitHub:** [**🔗 Repository**](https://github.com/YAE-Joon/Wheelbarrow)

***

## 🛠 기술 스택

#### Backend

- Language & Framework: Python, FastAPI
- ORM: SQLAlchemy
- Database Migration: Alembic
- Database: PostgreSQL
- Authentication: JWT, OAuth2
- API Documentation: FastAPI 자동 문서화 (Swagger UI)

#### 개발 도구

- Server: Uvicorn (ASGI)
- Containerization: Docker, Docker Compose
- Database Client: psycopg2
- Environment Management: Python-dotenv
- Build Tool: pip, requirements.txt

***
## 💡 주요 구현 기능

#### 1. MVC 아키텍처 기반 코드 구조 설계
```python
# Spring Boot의 @Entity와 동일한 역할
class Work(Base):
    __tablename__ = "work"

    # 복합 외래키 제약조건
    __table_args__ = (
        ForeignKeyConstraint(
            ['user_id', 'category_id'],
            ['category.user_id', 'category.id'],
            name='fk_work_category_user'
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    current_status = Column(SQLEnum(WorkStatus))

    # SQLAlchemy relationship 설정
    user = relationship("User", back_populates="works")
    category = relationship("Category", back_populates="works")
```
- SQLAlchemy ORM을 활용한 데이터베이스 엔티티 설계
- 복합 외래키 제약조건을 통한 데이터 무결성 보장
- Spring Boot JPA와 유사한 관계 매핑 구현

#### 2. RESTful API 컨트롤러 구현
```python
# Spring의 @RestController와 동일한 역할
router = APIRouter(prefix="/auth", tags=["Authentication"])

# Spring의 @PostMapping과 동일
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    service = AuthService(db)
    try:
        return service.create_user(user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
```

- FastAPI Router를 활용한 모듈화된 API 엔드포인트 설계
- 의존성 주입을 통한 데이터베이스 세션 관리
- HTTP 상태 코드 기반의 표준화된 응답 처리

#### 3. 계층화된 서비스 아키텍처
```python
class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def create_user(self, user_data: UserCreate) -> UserResponse:
        # 비즈니스 로직 구현
        existing_user = self.user_repo.get_by_email(user_data.email)
        if existing_user:
            raise ValueError("Email already exists")

        return self.user_repo.create(user_data)
```
- Repository 패턴을 통한 데이터 접근 계층 분리
- Service 계층에서 비즈니스 로직 처리
- 의존성 주입을 통한 느슨한 결합 구현

***
## 🎯 성과

- FastAPI를 활용한 고성능 비동기 API 시스템 구축
- SQLAlchemy ORM을 통한 효율적인 데이터베이스 관리
- MVC 패턴 적용으로 유지보수성과 확장성 확보

## 💪 문제 해결

#### 1. 복합 외래키 제약조건 설계

- 문제: 사용자별 카테고리 시스템에서 데이터 무결성 보장 필요
- 해결: SQLAlchemy의 ForeignKeyConstraint를 활용한 복합 키 설계
- 결과: 사용자간 데이터 격리 및 참조 무결성 확보

#### 2. 계층형 카테고리 구조에서 상위 카테고리 접근 최적화

- 문제 상황 분석
  - 계층형 카테고리에서 하위에서 상위 카테고리 접근 필요성
    - 최상위 카테고리는 '연관 프로젝트' (level 0)
    - 하위 프로젝트에서 최상위 프로젝트 정보 접근이 빈번함
    - 기존 방식: parent_id를 이용한 재귀적 쿼리 반복 수행
    - 성능 문제: N번의 쿼리가 필요 (깊이만큼 DB 호출)

```python
# 기존 방식: 재귀적 쿼리 (성능 이슈)
def get_root_category_recursive(category_id):
    category = get_category(category_id)
    while category.parent_id:
        category = get_category(category.parent_id)  # 매번 DB 호출
    return category  # N번의 쿼리 필요
```

- 해결방안: Path + Level 기반 최적화

  - Path 필드 도입으로 계층 구조 표현
    ```python
    # Path 예시: "/1/15/23" (root_id/parent_id/current_id)
    path = Column(String(1000), nullable=False)
    level = Column(Integer)  # 계층 깊이
    ```

  - 카테고리 생성 시 자동 Path 생성
    ```python
    def create(self, db_category) -> Category:
        self.db.add(db_category)
        self.db.flush()  # ID 생성
        category_id = db_category.id
        # Path에 자신의 ID 추가
        db_category.path = f"{db_category.path}/{str(category_id)}"
        self.db.commit()
    ```

  - Path 기반 단일 쿼리로 상위 카테고리 접근
    ```python
    def find_root_by_path(self, path: str) -> int:
        # Path에서 첫 번째 ID 추출 (root category)
        root_id = path.split('/')[1]  # "/1/15/23" → "1"
        return int(root_id)

    def find_id_by_path(self, path: str, user_id: int) -> int:
        # 단일 쿼리로 카테고리 조회
        return self.db.query(Category.id).filter(
            Category.path == path,
            Category.user_id == user_id
        ).first()
    ```

- 결과 및 성능 개선
  - N번의 재귀 쿼리 → 1번의 단일 쿼리로 성능 향상
  - Path 정규화를 통한 일관된 경로 관리
  - Level 정보 활용으로 계층별 효율적인 조회 가능
  - 상위 카테고리 접근 시간 복잡도: O(N) → O(1)

#### 3. Soft Delete 패턴에서 Join 쿼리 최적화

- 문제 상황 분석
  - 데이터 무결성 보장을 위한 Soft Delete 패턴 도입
    - 물리적 삭제 대신 `deleted_at` 필드로 논리적 삭제 처리
    - 데이터 복구 가능성과 참조 무결성 유지
    - BaseRepository에서 기본 쿼리에 soft delete 조건 적용

```python
# BaseRepository: 기본적으로 삭제되지 않은 데이터만 조회
def get_active_query(self, model):
    """삭제되지 않은 레코드만 조회하는 기본 쿼리"""
    return self.db.query(model).filter(
        model.deleted_at.is_(None)
    )
```

  - Join 쿼리에서 발생하는 문제점
    - RecurringWork와 Work 간 Join 시 양쪽 테이블의 soft delete 조건 필요
    - 단순히 BaseRepository 사용 시 주테이블만 필터링됨
    - 연관 테이블의 deleted_at 조건이 누락되어 삭제된 데이터 포함

- 해결방안: Join 조건에 Soft Delete 명시적 추가

  - 기존 문제 코드
    ```python
    # 문제: RecurringWork의 deleted_at 조건 누락
    works = self.get_active_query(Work).join(
        RecurringWork,
        Work.recurring_work_id == RecurringWork.id
    ).all()  # 삭제된 RecurringWork도 포함됨
    ```

  - 개선된 해결 코드
    ```python
    # 해결: Join 조건에 soft delete 명시적 추가
    works = (self.get_active_query(Work)
        .outerjoin(
            RecurringWork,
            and_(
                Work.recurring_work_id == RecurringWork.id,
                RecurringWork.deleted_at.is_(None)  # 명시적 조건 추가
            )
        )
        .options(contains_eager(Work.recurring_work))
        .filter(
            Work.user_id == user_id,
            Work.end_at.is_(None)
        ).all())
    ```

  - 다중 테이블 Join에서의 일관성 확보
    ```python
    # Category와 Work Join 시에도 동일한 패턴 적용
    return self.db.query(Work, Category.path.label('category_path'))
        .join(Category, Work.category_id == Category.id)
        .filter(
            Work.user_id == user_id,
            Work.deleted_at.is_(None),  # Work soft delete
            Category.deleted_at.is_(None),  # Category soft delete
            Work.end_at.is_not(None)
        ).all()
    ```

- 결과 및 데이터 무결성 향상
  - Join된 모든 테이블에서 삭제된 데이터 완전 제외
  - 논리적 삭제된 반복업무가 일반업무 조회에 영향을 주지 않음
  - 데이터 일관성 보장 및 예상치 못한 삭제된 데이터 노출 방지
  - 복잡한 연관 관계에서도 안정적인 데이터 조회 보장

#### 4. 비동기 처리와 의존성 주입

- 문제: FastAPI의 비동기 특성과 데이터베이스 세션 관리의 복잡성
- 해결: Depends를 활용한 의존성 주입 패턴 적용
- 결과: 효율적인 리소스 관리 및 코드 재사용성 향상

***
## 🌱 프로젝트를 통해 배운 점

- FastAPI의 비동기 프로그래밍과 타입 힌트 활용법
- SQLAlchemy ORM을 통한 객체-관계 매핑 설계 방법
- MVC 아키텍처 패턴의 실무 적용과 계층간 책임 분리
- Docker를 활용한 개발 환경 일관성 확보 방법
- Python 생태계에서의 웹 애플리케이션 개발 전반