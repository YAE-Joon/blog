---
title: "MeetStudy"
description: "meetStudy"
tag: ["MeetStudy"]
sidebar_position: 3
---
## 학습 커뮤니티 플랫폼 MeetStudy 
#### 실시간 채팅 기능 구현
***
## 📝 프로젝트 개요

- 프로젝트명: MeetStudy (학습 커뮤니티 플랫폼)
- 개발 기간: 2024.05.13 ~ 2024.06.08 (4주)
- 인원 구성: Backend 6명, Frontend 2명 (총 8명)
- 담당 역할: 실시간 채팅 시스템 설계 및 구현
- **GitHub:** [**🔗 Repository**](https://github.com/YAE-Joon/meetstudy)
***

## 🛠 기술 스택
#### Backend

- Language & Framework: Spring Boot
- WebSocket: STOMP
- Security: Spring Security, JWT
- Database: MariaDB

#### Frontend

- Language: TypeScript
- Framework: React
- Tools: Discord, NginX

#### Deployment

- Cloud: AWS
- Server: NginX
- CI/CD: Git Actions
*** 
## 💡 주요 구현 기능
#### 1. 실시간 채팅 시스템 구현

- WebSocket을 활용한 실시간 양방향 통신 구현
- STOMP 프로토콜을 통한 메시지 브로커 활용
- Set 자료구조를 활용한 WebSocket 세션 관리

#### 2. 채팅방 관리 기능

- 채팅방 CRUD 기능 구현
- 공지사항 설정 및 관리
- 방장 권한 관리 시스템
- 무한 스크롤 방식의 이전 메시지 조회

#### 3. 보안 기능 강화

- JWT 토큰 기반의 사용자 인증
- WebSocket 연결 보안 강화
- Handler 레벨의 사용자 권한 검증
***
## 🎯 성과 및 문제 해결
#### 1. WebSocket 보안 강화

- 문제: WebSocket이 JWT 토큰 인증을 기본 지원하지 않음
- 해결:
    - WebSocket 헤더에 JWT 토큰 포함
    - Handler에서 자체 인증 로직 구현
    - 추가 보안 계층 구현으로 안전성 강화



#### 2. 채팅 성능 최적화

- 커서 기반 페이지네이션 구현
- 무한 스크롤 방식 메시지 로딩
- 채팅방 입장 시점 기준 메시지 조회 최적화

#### 3. 프론트엔드 협업 강화

- STOMP 프로토콜 연동을 위한 긴밀한 협력
- 실시간 테스트 및 디버깅 협업
- 효율적인 커뮤니케이션 체계 구축

## 🌱 배운 점

- WebSocket과 STOMP 프로토콜에 대한 실무 경험
- 실시간 통신 시스템의 보안 설계 방법론
- 프론트엔드와의 효율적인 협업 방식
- 성능 최적화와 쿼리 튜닝 경험
- 대규모 실시간 시스템 설계 및 구현 능력

🔗 프로젝트 링크
