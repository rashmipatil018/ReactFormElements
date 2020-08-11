import React, {Component} from 'react';
import SingleInput from '../components/SingleInput';
import DefaultInput from '../components/DefaultInput';
import TextArea from '../components/TextArea';
import CreatableSelect from 'react-select/creatable';
import { components } from "react-select";
import { skillOptions } from '../docs/data';
import axios from 'axios';

class FormContainer extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			valueRequired: true,
			Name: '',
			currentCount: 0,
			currentDefault:'',
			choice:[],
			description: '',
		};
		
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleClearForm = this.handleClearForm.bind(this);
		this.handleFullNameChange = this.handleFullNameChange.bind(this);
		this.handleCurrentCountChange = this.handleCurrentCountChange.bind(this);
		this.handleDefault = this.handleDefault.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.myChangeHandler= this.myChangeHandler.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}
	componentDidMount() {
		fetch('./fake_db.json')
		//fetch('http://www.mocky.io/v2/566061f21200008e3aabd919')
			.then(res => res.json())
			.then(data => {
				this.setState({
					Name: data.Name,
					currentCount: data.currentCount,
					description: data.description
				});
			});
	}
	onChange = (e, option) => {
		if (option.removedValue && option.removedValue.isFixed) 
		return;

		this.setState({
		  choice: e
		});
	}
	handleFullNameChange(e) {
		this.setState({ Name: e.target.value }, () => console.log('name:', this.state.Name));
	}
	handleCurrentCountChange(e) {
		this.setState({ currentCount: e.target.value }, () => console.log('count', this.state.currentCount));
	}
	handleDefault(e) {
		this.setState({ currentDefault: e.target.value }, () => console.log('count', this.state.currentDefault));
	}
	handleChoice(e) {
		this.setState({ choice: e.target.value }, () => console.log('count', this.state.choice));
	}
	handleDescriptionChange(e) {
		this.setState({ description: e.target.value }, () => console.log('description', this.state.description));
	}
	handleChange = selected => {
		 this.setState({ choice: selected }); 	 
	};
	handleClearForm(e) {
		e.preventDefault();
		this.setState({
			Name: '',
			currentCount: 0,
			currentDefault:'',
			choice:[],
			description: '',
		});
	}
	myChangeHandler = (event) => {
		this.setState({currentDefault: event.target.value});   
	}
	handleInputChange(event) {
		const target = event.target;
		const value = target.name === 'valueRequired' ? target.checked : target.value;
		const name = target.name;
	
		this.setState({
		  [name]: value
		});
	}
	handleFormSubmit(e) {
		e.preventDefault();

		//Code to add Default value into the list of choices
		var flag=true; 		
		for (var i = 0; i < this.state.choice.length; i++) { 			
			console.log(this.state.choice[i].value===this.state.currentDefault); 			
			if(this.state.choice[i].value===this.state.currentDefault){ 				
				flag = false; 			
			} 		
		} 		
		if(flag){ 			
			this.state.choice.push(this.state.currentDefault); 		
		}
			
		const formPayload = {
			Name: this.state.Name,
			currentCount: this.state.currentCount,
			currentDefault:this.state.currentDefault,
			choice: this.state.choice,
			description: this.state.description,

		};

		//Code that creates a json object and posts it to the console
		axios.post ('http://www.mocky.io/v2/566061f21200008e3aabd919', formPayload)
		.then(response => {
			console.log(response)
			alert("Form submitted");
		})
		.catch(error=> {
			console.log(error)
		})
		console.log('Post Data:', formPayload);
		this.handleClearForm(e);
	}
	
	render() {
		const { choice } = this.state;

		const isValidNewOption = (inputValue, selectValue) =>
		inputValue.length > 0 && selectValue.length < 5;
		//Above code is to limit the number of new choices to add to 5

		const Menu = props => {
			const optionSelectedLength = props.getValue().length || 0;
			return (
			  <components.Menu {...props}>
				{optionSelectedLength < 10? (
				  props.children
				) : (
				  <div style={{ margin: 15 }}>Max limit achieved</div>
				)}
			  </components.Menu>
			);
		  }; //Code to limit the number of choices to 10

		return (
			<form className="container" onSubmit={this.handleFormSubmit}>
				<h5>Field Builder</h5>
				<SingleInput
					inputType={'text'}
					title={'Name'}
					name={'name'}
					controlFunc={this.handleFullNameChange}
					content={this.state.Name}
					placeholder={'Enter your name'} 
				/>

				<label>
         			 Type Multi-Select {""}
         		<input
            		name="valueRequired"
            		type="checkbox"
            		checked={this.state.valueRequired}
           			onChange={this.handleInputChange} />
        		A value is required
				</label>

				<DefaultInput
					inputType={'string'}
					title={'Default value'}
					name={'currentDefault'}
					controlFunc={this.myChangeHandler}
					content={this.state.currentDefault}
					placeholder={'Enter default value'} 
				/>

				<label>Skills (Please enter upto 10 choices)</label>

				{/* Code to add and remove choices from the list of choices */}
				<CreatableSelect
						components={{ Menu }}
						isMulti
						isValidNewOption={isValidNewOption}
						value={choice}
						content={this.state.choice}
						onChange={this.handleChange}
						options={skillOptions}
				/>
				<SingleInput
					inputType={'number'}
					title={'How many years of experience do you have?'}
					name={'currentCount'}
					controlFunc={this.handleCurrentCountChange}
					content={this.state.currentCount}
				/>
				<TextArea
					title={'Describe your previous work experience'}
					rows={5}
					resize={false}
					content={this.state.description}
					name={'currentPetInfo'}
					controlFunc={this.handleDescriptionChange}
					placeholder={'Please be thorough'} 
				/>
				<input
					type="submit"
					className="btn btn-primary float-right"
					value="Submit"
				/>
				<button
					className="btn btn-link float-left"
					onClick={this.handleClearForm}>Clear form
				</button>
			</form>
		);
	}
}

export default FormContainer;
