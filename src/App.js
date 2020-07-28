import React from 'react';
import './App.css';

const api = {
	key :"8644a92a0c0c4120b86d1f7b956731d5",
	base : "https://api.openweathermap.org/data/2.5/"
}

const dateBuilder = (d)=>{
	let months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	let days = ['Sun','Mon','Tues','Wednes','Thurs','Fri','Satur'];

	let day  = days[d.getDay()];
	let date = d.getDate();
	let month = months[d.getMonth()];
	let year = d.getFullYear();
	
	return `${day}day ${date} ${month} ${year}`;
}

const icon = (w)=>{
	if(w==="Clouds"){
		return "☁️";
	}
	if(w==="Haze"){
		return "🌫️";
	}
	if(w==="Rain"){
		return "🌧️";
	}
	if(w==="Sunny"){
		return "☀️";
	}
	if(w==="Thunderstorm"){
		return "⛈️";
	}
	if(w==="Snow"){
		return "🌨";
	}
	if(w=="Clear"){
		let h = new Date();
		h = h.getHours();
		if(h>=6 && h<=18)
			return "🏞";
		else
			return"🌌";
	}
}

function Input(props,state){
	let query;
	return(
		<div className="serch-box">
			<div className="input">
                	<input
                        	type="text"
                       		className="search-bar"
                       		placeholder="Search..."
                        	onChange={e=>props.setQuery(e.target.value)}
				value={query}
                        	onKeyPress={e=>props.search(e)}
                 	/>
			</div>
	         </div>
	);
}

function Display(props){
	return(
		<div>
			<div className="location-box">
                	<div className="location">{props.weather.city},{props.weather.country}</div>
                	<div className="date">{props.weather.date}</div>
          		</div>

          		<div className="weather-box">
                	<div className="temp">{props.weather.temp}°C</div>
                	<div className="weather">{props.weather.weather}</div>
                	<div className="icon">{icon(props.weather.weather)}</div>
          		</div>
		</div>

	);
}

class App extends React.Component{
	
	constructor(props){
		super(props);
		this.state={
			result : 0,	//0:noSearch,1:correctResult,2:invalidSerach
			weather : {},
			theme : 'app',
			query : '',
		}
		this.setQuery = this.setQuery.bind(this);
		this.setTheme = this.setTheme.bind(this);
		this.setWeather = this.setWeather.bind(this);
		this.search = this.search.bind(this);
	}

	setQuery(query){
		this.setState({
			query : query,
		})
	}

	setTheme(weather){
		let theme ="app";
		if(weather.temp>21)
			theme = "app warm"
		if(weather.weather==="Clouds")
			theme = "app gray"
		if(weather.weather==="Snow")
			theme = "app white"
		if(weather.weather==="Rain")
			theme = "app"
		if(weather.weather==="Thunderstorm" || weather.weather==="Haze")
			theme = "app darkgray"
		this.setState({
			theme : theme,
		})
	}

	setWeather(result){
		let weather;
		if(result.sys){
			weather={
				city: result.name,
				country : result.sys.country,
				date : dateBuilder(new Date()),
				weather : result.weather[0].main,
				temp : Math.round(result.main.temp),
			}

		this.setState({
			result : 1,
			weather : weather,
		})

		this.setTheme(weather);
		}
		else {
			this.setState({
				result : 2
			})
		}
		
	}

	search(evt){
		if(evt.key==="Enter"){
                	fetch(`${api.base}weather?q=${this.state.query}&units=metric&APPID=${api.key}`)
                        	.then(res=>res.json())
                       		.then(result=>{
                                	this.setWeather(result);
                                	this.setQuery('');
                                //	console.log(weather);
                        	}
                        );

        	}
	}

	render(){
		let display;

		if(this.state.result===0){
			display = <div className="initial">Search City for getting weather</div>
		}
		else if(this.state.result===1){
			display = <Display weather={this.state.weather}/>
		}
		else{
			display = <div className="warning">City not found</div>
		}
	
		return(	
   			<div className={this.state.theme}>
				<main>
	  				<Input search={this.search} setQuery={this.setQuery} />
	  				{display}
				</main>		
    			</div>
  		);
	}
}

export default App;
