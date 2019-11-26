import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {

  Label,
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Modal,
  TextArea,
  Form,
  Container,
  Segment
} from 'semantic-ui-react'

import { createRecipe, deleteRecipe, getRecipes, patchRecipe } from '../api/recipes-api'
import Auth from '../auth/Auth'
import { Recipe } from '../types/Recipe'

interface RecipesProps {
  auth: Auth
  history: History
}

interface RecipesState {
  recipes: Recipe[]
  newRecipeName: string
  updatePosition: number
  loadingRecipes: boolean
}

export class Recipes extends React.PureComponent<RecipesProps, RecipesState> {
  state: RecipesState = {
    recipes: [],
    newRecipeName: '',
    updatePosition: -1,
    loadingRecipes: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newRecipeName: event.target.value })
  }


  handleNameUpdateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      recipes: update(this.state.recipes, {
        [this.state.updatePosition]: { name: { $set: event.target.value } }
      })
    })
  }


  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      recipes: update(this.state.recipes, {
        [this.state.updatePosition]: { description: { $set: event.target.value } }
      })
    })
  }

  onSaveButtonClick = async (pos: number) => {
    try {
      const recepie = this.state.recipes[pos]
      await patchRecipe(this.props.auth.getIdToken(), recepie.recipeId, {
        name: recepie.name,
        description: recepie.description

      })
      alert('Recipe updated')
    } catch {
      alert('Recipe update failed')
    }
  }



  onEditButtonClick = (recipeId: string) => {
    this.props.history.push(`/recipes/${recipeId}/edit`)
  }

  onRecipeCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newRecipe = await createRecipe(this.props.auth.getIdToken(), {
        name: this.state.newRecipeName
      })
      this.setState({
        recipes: [...this.state.recipes, newRecipe],
        newRecipeName: ''
      })
    } catch {
      alert('Recipe creation failed')
    }
  }

  onRecipeDelete = async (recipeId: string) => {
    try {
      await deleteRecipe(this.props.auth.getIdToken(), recipeId)
      this.setState({
        recipes: this.state.recipes.filter(recipe => recipe.recipeId != recipeId)
      })
    } catch {
      alert('Recipe deletion failed')
    }
  }

  loadRecipes = async () =>  {
    try {

      this.setState({
        loadingRecipes: true
      })

      const recipes = await getRecipes(this.props.auth.getIdToken())
      this.setState({
        updatePosition:-1,
        recipes,
        loadingRecipes: false
      })
    } catch (e) {
      alert(`Failed to fetch Recipes: ${e.message}`)
    }
  }


  async componentDidMount() {
    await this.loadRecipes()
  }

  render() {
    return (
      <div>
        <Header as="h1">Recipes</Header>

        {this.renderCreateRecipeInput()}

        {this.renderRecipes()}
      </div>
    )
  }

  renderCreateRecipeInput() {
    return (

      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Recipe',
              onClick: this.onRecipeCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Write delicious recipes..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderRecipes() {
    if (this.state.loadingRecipes) {
      return this.renderLoading()
    }

    return this.renderRecipesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Recipes
        </Loader>
      </Grid.Row>
    )
  }

  renderRecipesList() {
    return (
      <Grid padded>
        {this.state.recipes.map((recipe, pos) => {
          return (
            <Grid.Row key={recipe.recipeId}>
              <Grid.Column width={3} verticalAlign="middle">
                <Label color='red' ribbon>
                  {recipe.name}
                </Label>
              </Grid.Column>
              <Grid.Column width={10} textAlign="justified" floated={recipe.description != null ? "left" : "right"}>

                <Segment basic>
                  {recipe.attachmentUrl && (
                    <Image src={recipe.attachmentUrl} size="small" floated='left' />
                  )}

                  <p>
                    {recipe.description != null ? recipe.description :

                      <Label basic color='blue' pointing='right'>
                        Write your recipe by clicking edit button..
                    </Label>
                    }
                  </p>
                </Segment>




              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Modal 
                 
                  
                 onClose={this.loadRecipes}
                  trigger={<Button
                  icon
                  color="blue"
                  onClick={() => this.setState({
                    updatePosition: pos
                  })}
                >
                  <Icon name="pencil" />
                </Button>}>
                  <Modal.Header>Select a Photo</Modal.Header>
                  <Modal.Content image>
                    <Image wrapped size='medium' src={recipe.attachmentUrl ? recipe.attachmentUrl : 'https://react.semantic-ui.com/images/wireframe/image.png'} />
                    <Modal.Description>

                      <Container>
                        <Form>
                          <Form.Field
                            id='form-input-control-first-name'
                            control={Input}
                            label='Meal name'
                            placeholder='Meal name'
                            value={recipe.name}
                            onChange={this.handleNameUpdateChange}
                          />
                          <Form.Field
                            id='form-textarea-control-recipe'
                            control={TextArea}
                            label='Recipe'
                            placeholder='Recipe'
                            rows={30}
                            value={recipe.description}
                            onChange={this.handleDescriptionChange}
                          />
                        </Form>
                      </Container>
                    </Modal.Description>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button color='green' onClick={() => this.onSaveButtonClick(pos)}>
                      <Icon name='checkmark' /> Save
                    </Button>
                  </Modal.Actions>
                </Modal>




              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="olive"
                  onClick={() => this.onEditButtonClick(recipe.recipeId)}
                >
                  <Icon name="upload" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onRecipeDelete(recipe.recipeId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>

              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>


    )
  }
}
