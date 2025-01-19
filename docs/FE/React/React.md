***
## React
 - HTML 과 JavaScript를 사용하여 DOM(Document Object Model)에 접근할 때, 인터랙션이 자주 발생하고, 이에 따라 동적으로 UI를 표현해야된다면, 규칙이 정말 다양해지고, 관리하기도 힘들어 질 것이다.(코드가 난잡해진다는 뜻)'
 - 처리해야 할 이벤트도 다양해지고, 관리해야 할 상태값도 다양해지고, DOM도 다양해지게 된다면, 업데이트해야할 규칙도 많이 복잡해지므로, 유지보수에 매우 힘들어진다.
 - 이러한 어려움 때문에 Ember, Backbone,AngularJS등, 프레임워크가 만들어졌는데, 작동방식이 각각 다르지만, JS의 특정값이 바뀌면 특정 DOM의 속성이 바뀌도록 연결을 해주어서, 업데이트 하는 작업도 간소화했다.
 - 리액트의 경우 : 상태가 변경되었을 때, 상태에 따라 DOM을 어떻게 업데이트 할 지 규칙을 정하는 것이 아니라, 아예 다 날려버리고 처음부터 모든걸 새로 만들어서 보여준다는 아이디어에서 출발하였다.
	 - 위 발상의 장점 : 업데이트를 어떻게 해야할 지에 대한 고민을 하나도 하지 않아도 되어서 개발이 쉬워진다.
	 - 단점 : 동적인 UI를 보여주기 위해 모든 것을 날리고 새로 시작한다면, 속도가 매우 느려질 것이다.
***
### Virtual DOM
- 가상의 DOM으로 브라우저에 실제로 보여지는 DOM이 아니라, 메모리에 가상으로 존재하는 DOM으로서 JS객체이기 때문에, 작동 성능이 실제 브라우저에서 DOM을 보여주는 것보다 속도가 훨씬 빠르다.
- 리액트는 상태가 업데이트되면, 업데이트가 필요한 곳의 UI를 Virtual DOM을 통해 렌더링, 
- 효율적인 비교 알고리즘을 통해 실제 브라우저에 보여지고 있는 DOM과 비교를 한 후 차이가 있는 곳을 감지하여 실제 DOM에 패치시켜준다.![React-20250119154436139.webp](images%2FReact-20250119154436139.webp)
***
### 용어 정리
- Node.js : Chrome V8 JS 엔진으로 빌드된 JavaScript 런타임 환경. 이를 통해 서버 사이드 애플리케이션을 개발할 수 있다. Node.js는 비동기식 이벤트 기반 아키텍처를 사용하여 빠르고 확장 가능한 네트워크 애플리케이션을 만들 수 있도록 지원한다. Webpack, Babel 같은 도구들이 Node.js기반으로 만들어져 있다.
	- Webpack(최근에는 vite를 쓴다.), Babel : 리액트 프로젝트를 만들면, 여러 컴포넌트들을 여러가지 파일로 분리해서 저장 할 것이고, 이 컴포넌트는 일반 JavaScript가 아니라 JSX라는 문법으로 작성하게 된다.여러가지 파일을 한개로 결합하기 위해 Webpack이라는 도구를 사용, JSX를 비롯한 새로운 자바스크립트 문법들을 사용하기 위해서 Babel이라는 도구를 사용한다.
- npm : Node Package Manager 의 약자로, 자바스크립트 런타임 환경인 Node.js에서 사용되는 패키지 관리자. npm을 사용하면, Node.js 애플리케이션을 개발할 때 필요한 여러 종속성 패키지들을 손쉽게 설치, 관리할 수 있다. 패키지 설치, 업데이트 제거, 의존성 관리 등의 기능을 제공
- Yarn : npm의 개선된 버전이라고 생각하면 된다. 더 나은 속도와 캐싱 시스템을 사용할 수 있다.
***
## 리액트 컴포넌트

`import React from 'react';` : 
- 리액트 컴포넌트는 import문을 통해 리액트를 불러와야 한다. 함수형태와 클래스형태로 모두 작성할 수 있다.
- 리액트 컴포넌트에서 XML형식의 값을 반환할 수 있다. 이를 JSX라고 부른다.
`export default Hello;` :
- 코드의 최하단에서는 Hello라는 컴포넌트를 내보낼 수 있다. 이렇게 해주면 다른 컴포넌트에서 불러와서 사용할 수 있다.  
- 컴포넌트는 일종의 UI 조각으로, 쉽게 재사용이 가능하다.
`ReactDOM.render(<App />, document.getElementById('root'));`:
- ReactDOM.render 의 역할은, 브라우저에 있는 실제 DOM 내부에 리액트 컴포넌트를 랜더링하겠다는 의미 이다.
- `id = root` 인 DOM을 선택하고 있다. 그렇게 되면 `<div id="root"></div>` 인 곳 내부에, 리액트 컴포넌트가 랜더링 된다는 것이다.
***
## JSX
- JSX는 리액트의 생김새를 정의할 때 사용하는 문법이다. 얼핏 HTML같이 생겼지만, 실제로는 javascript이다.
- JSX가 JavaScript로 제대로 변환이 되려면, 규칙이 필요하다. 
	- 태그는 꼭 닫혀있어야 한다. html에서 `input` 이나 `br` 태그는 닫지않고 사용하기도 하지만, 리액트는 그렇게 사용하면 안된다. 
	- 두개 이상의 태그는 꼭 하나의 태그로 감싸져있어야 한다.
```JSX
import React from 'react';
import Hello from './Hello';

function App() {
  return (
    <Hello />
    <div>안녕히계세요.</div>
  );
}

export default App;```
- 	
     - 위 코드는 문제가 발생한다.
	- ```
    <Hello />
    <div>안녕히계세요.</div>
	    ```
     하나의 태그로 감싸져있지 않기 때문, 만약 `<div>` 로 감싸기 좋지 않은 상황이 있을 경우, `<Fragment>`라는 태그를 사용하면 된다. 태그를 작성할 때 이름을 사용하지 않고 `<></>` 로 작성을 하면 된다. 브라우저 상에서는 별도의 엘리먼트로 나타나지 않는다.
	- JavaScript 변수를 보여주어야 할 경우에는 `{}`로 감싸서 보여준다.
	- Style 과 className 
		- JSX에서 태그에 style과 CSS class를 설정하는 방법은 HTML에서 설정하는 방법과 다르다.
		- 인라인 스타일은 객체 형태로 작성해야 한다. 
		- `background-color`처럼 - 로 구분되어 있는 이름은 camelCase로 작성해야 한다.
```JSX
import React from 'react';
import Hello from './Hello';

function App() {
  const name = 'react';
  const style = {
    backgroundColor: 'black',
    color: 'aqua',
    fontSize: 24, // 기본 단위 px
    padding: '1rem' // 다른 단위 사용 시 문자열로 설정
  }

  return (
    <>
      <Hello />
      <div style={style}>{name}</div>
    </>
  );
}

export default App;
```
- 

-SS class를 설정하는 경우, `class=`
 가 아니라 `className=` 으로 설정을 해주어야 한다. 
***
## props
- 컴포넌트의 props: props는 properties 의 줄임말이다. 어떠한 값을 컴포넌트에게 전달해 주어야 할 때, props를 사용한다.
```jsx
import React from 'react';

function Hello({ color, name }) {
  return <div style={{ color }}>안녕하세요 {name}</div>
}

Hello.defaultProps = {
  name: '이름없음'
}

export default Hello;
```
- Hello에서 `{color,name}` properties를 받고, 그 name 과 color를 넣어준다.
- default값으로 이름없음을 넣어줄 수 있다.
```jsx
import React from 'react';
import Hello from './Hello';

function App() {
  return (
    <>
      <Hello name="react" color="red"/>
      <Hello color="pink"/>
    </>
  );
}

export default App;
```
- 이렇게 되면 App()에서 Hello 태그에 이름과 color를 넣어주면 해당 properties가 넣어진다.
## props.child
- 컴포넌트 태그 사이에 넣은 값을 조회하고 싶을 땐, `props.children` 을 조회하면 된다.
```JSX
import React from 'react';

function Wrapper({ children }) {
  const style = {
    border: '2px solid black',
    padding: '16px',
  };
  return (
    <div style={style}>
      {children}
    </div>
  )
}

export default Wrapper;
```
- 즉, children 을 받는데, 이건 컴포넌트 태그 사이에 color 나 name을 넣은 경우 그 값이 표현되게 된다.
- 정리하면, 자기 자신안에 태그를 호출하고 싶다면, props 를 호출하고, 호출된 곳의 태그 값을 쓰고 싶다면 children 을 넣어주면 된다.
***