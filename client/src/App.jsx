import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

function App() {

  return (
    <div className="">
      <h1 style={{color:'white'}}>fhdjkghjdkfh</h1>
      <header>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </div>
  );
}

export default App;
