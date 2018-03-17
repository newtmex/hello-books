import { render } from 'react-dom';
import { Provider } from 'react-redux';
import style from '../public/style/style.scss';
import store, { history } from './store';
import App from '../components/App';


render(
    <Provider store = { store }>
        <App history = { history }/>
    </Provider>,
    document.getElementById('root'),
);
