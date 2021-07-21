
export class Graph {
  constructor() {
    this.nodes = {}
  }
  
  addLink(fromName, toName) {
    
    let fromNode = this.nodes[fromName]
    if(!fromNode) {
      fromNode = new Node(fromName)
      this.nodes[fromName] = fromNode
    }
    fromNode.addLink(toName)

    let toNode = this.nodes[toName]
    if(!toNode) {
      toNode = new Node(toName)
      this.nodes[toName] = toNode
    }
    toNode.addLink(fromName)
  }

  getNode(name) {
    return this.nodes[name]
  }

  asTree(startName) {
    const state = []
    this._asTree(startName, state, new Set())    
    return state
  }

  _asTree(currentNodeName, state, visited) {
    if(!visited.has(currentNodeName)) {
      let currentVisited = new Node(currentNodeName)

      state.push(currentVisited)
      visited.add(currentNodeName)
      
      try {
        const currentNode = this.getNode(currentNodeName)
  
        currentNode.getLinks().forEach((linkName) => {
          const nextNode = this.getNode(linkName)
          this._asTree(nextNode.name, currentVisited.getLinks(), visited)
        })
      } catch {
        return
      }
    }
  }
} 

class Node {
  constructor(name) {
    this.name = name
    this.children = []
  }

  addLink(name) {
    this.children.push(name)
  }

  setLinks(links) {
    this.children = links
  }

  getLinks() {
    return this.children
  }
}