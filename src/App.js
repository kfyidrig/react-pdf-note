import './App.css';
import {Grommet} from 'grommet';
import HomePage from "./pages/homePage";
import {HashRouter,Switch,Route} from 'react-router-dom';

function App() {
    const theme = {
        global: {
            colors: {
                green: '#00739D',
            },
            font: {
                family: 'Roboto',
                size: '18px',
                height: '20px',
            },
        },
    };
    return (
        <Grommet theme={theme} themeMode="dark" full>
            <HashRouter>
                <Switch>
                    <Route path='/' exact component={HomePage}/>
                    <Route path='/note' exact component={HomePage}/>
                </Switch>
            </HashRouter>
        </Grommet>
    )
}

export default App;
